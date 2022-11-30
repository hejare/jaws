import { BreakoutDataType, upsertBreakout } from "../db/breakoutsEntity";
import { getLatestConfig, postConfig } from "../db/configsEntity";
import { getDailyRun, postDailyRun, putDailyRun } from "../db/dailyRunsEntity";
import { DailyRunDataType, DailyRunStatus } from "../db/dailyRunsMeta";
import { postError } from "../db/errorsEntity";
import { upsertTicker } from "../db/tickersEntity";
import { getSessions, triggerDailyRun } from "../services/sharksterService";
import { postSlackMessage } from "../services/slackService";
import { getNewRunId } from "./helpers";

interface BreakoutNoImage {
  relative_strength: number;
  breakout_level: number;
  symbol: string;
}
interface Breakout extends BreakoutNoImage {
  image: string;
}

type Config = Record<string, string | number>;

type DailyRunBody = {
  runId: string;
  breakouts: Breakout[];
  config: Config;
  duration: number;
  rangeStart: number;
  rangeEnd: number;
};

type DailyRunErrorBody = {
  runId: string;
  message: string;
  cell: string;
  rangeStart: number;
  rangeEnd: number;
};

const isNotebookIdle = (
  sessions: [{ path: string; kernel: { execution_state: string } }],
) => {
  const nonIdleSession = sessions.find(
    (session) => session.kernel.execution_state !== "idle",
  );
  return !nonIdleSession;
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
  const newRunId = getNewRunId();
  await postDailyRun(newRunId);
  void triggerDailyRun(newRunId);
  return Promise.resolve(newRunId);
};

const isConfigSame = (latestConfig: Config, config: Config) => {
  const latestConfigEntities = Object.keys(latestConfig);
  const configEntities = Object.keys(config);

  // Note: since latest config (the ones existing in Frestore) always get their _ref prop extended to iteself, the difference between incoming config and existing config should be 1, if objects are identical.
  if (latestConfigEntities.length - configEntities.length !== 1) {
    return false;
  }

  const foundMissmatches = configEntities.reduce((result, configName) => {
    return result + (latestConfig[configName] !== config[configName] ? 1 : 0);
  }, 0);
  return !foundMissmatches;
};

export const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  const { runId, config, breakouts, duration, rangeStart, rangeEnd } =
    dailyRunBody;

  // update DailyRun
  let dailyRun: null | DailyRunDataType = await getDailyRun(runId);

  if (dailyRun === null) {
    dailyRun = await postDailyRun(runId);
  }

  await putDailyRun(runId, {
    ...dailyRun,
    status: DailyRunStatus.COMPLETED,
    duration: duration,
    timeEnded: Date.now(),
    breakoutsCount: breakouts.length,
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
  });

  // Get/Post config
  const newConfig = {
    ...config,
    timestamp: Date.now(),
  };
  const latestConfig = await getLatestConfig();
  let configRef: string | undefined = latestConfig?._ref;

  if (!configRef || (latestConfig && !isConfigSame(latestConfig, newConfig))) {
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
  await postSlackMessage(runId);
};

export const storeDailyRunError = async (dailyRunBody: DailyRunErrorBody) => {
  const { runId, message, cell, rangeStart, rangeEnd } = dailyRunBody;

  console.log("Sharkster message:", { message, runId, cell });
  await postError(runId, message, {
    cell,
    rangeStart,
    rangeEnd,
  });

  // update DailyRun
  const dailyRun: null | DailyRunDataType = await getDailyRun(runId);
  const nowTimestamp = Date.now();

  await putDailyRun(runId, {
    ...(dailyRun || {
      timeInitiated: nowTimestamp,
      breakoutsCount: 0,
    }),
    runId,
    rangeStart,
    rangeEnd,
    status: DailyRunStatus.ERROR,
    duration:
      dailyRun && dailyRun.timeInitiated
        ? nowTimestamp - new Date(dailyRun.timeInitiated).getTime()
        : 0,
    timeEnded: nowTimestamp,
  });
};
