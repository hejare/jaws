import { BreakoutDataType, upsertBreakout } from "../db/breakoutsEntity";
import { getLatestConfig, postConfig } from "../db/configsEntity";
import { getDailyRun, postDailyRun, putDailyRun } from "../db/dailyRunsEntity";
import { DailyRunDataType, DailyRunStatus } from "../db/dailyRunsMeta";
import { getTicker, upsertTicker } from "../db/tickersEntity";
import { getSessions, triggerDailyRun } from "../services/sharksterService";

interface Breakout {
  relative_strength: number;
  breakout_level: number;
  image: string;
  symbol: string;
}

type Config = Record<string, string | number>;
type DailyRunBody = {
  runId: string;
  runTime: number;
  breakouts: Breakout[];
  config: Config;
};

const isNotebookIdle = (
  sessions: [{ path: string; kernel: { execution_state: string } }],
) => {
  const matchedSession = sessions.find(
    (session) => session.path.indexOf("get_todays_picks") > -1,
  );
  return matchedSession?.kernel.execution_state === "idle";
};

export const triggerDailyrun = async () => {
  const sessions = await getSessions();
  const isIdle = isNotebookIdle(sessions);

  if (!isIdle) {
    return Promise.reject(
      new Error(
        "Process is not idle. Could be due to previous execution is still ongoing.",
      ),
    );
  }

  const resp = await triggerDailyRun();
  const runId = resp.split("\n")[0].replace("run_id= ", "");
  await postDailyRun(runId);
  return Promise.resolve(runId);
};

const isConfigDifferent = (latestConfig: Config, config: Config) => {
  const configEntities = Object.keys(config);
  const latestConfigEntities = Object.keys(latestConfig);

  // Note: since latest config (the ones existing in Frestore) always get their _ref prop extended to iteself, the difference between incoming config and existing config should be 1, if objects are identical.
  if (latestConfigEntities.length - configEntities.length !== 1) {
    return false;
  }

  const foundMissmatches = configEntities.reduce((result, configName) => {
    return result + (latestConfig[configName] !== config[configName] ? 1 : 0);
  }, 0);
  return !!foundMissmatches;
};

export const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  const { runId, runTime, config, breakouts } = dailyRunBody;
  console.log({ runId });
  // update DailyRun
  let dailyRun: null | DailyRunDataType = await getDailyRun(runId);

  console.log("existing dailyRun", dailyRun);
  if (dailyRun === null) {
    dailyRun = await postDailyRun(runId);
  }

  await putDailyRun(runId, {
    ...dailyRun,
    status: DailyRunStatus.COMPLETED,
    duration: runTime,
    timeEnded: Date.now(),
  });

  // Get/Post config
  const newConfig = {
    ...config,
    timestamp: Date.now(),
  };
  const latestConfig = await getLatestConfig();
  let configRef: string | undefined = latestConfig?._ref;
  if (
    !configRef ||
    (latestConfig && isConfigDifferent(latestConfig, newConfig))
  ) {
    const { _ref } = await postConfig(newConfig);
    configRef = _ref;
  }

  const promises = breakouts.map((breakout) => {
    async function handleBreakout() {
      const { relative_strength, breakout_level, image, symbol } = breakout;

      await upsertTicker(symbol); // symbol === tickerRef

      // Please linting:
      if (!configRef) {
        return;
      }

      // Post Breakout for each breakout item
      const breakoutData: BreakoutDataType = {
        dailyRunRef: runId,
        configRef,
        tickerRef: symbol,
        relativeStrength: relative_strength,
        breakoutValue: breakout_level,
        image,
      };
      await upsertBreakout(breakoutData);
    }
    return handleBreakout();
  });
  await Promise.all(promises);
};
