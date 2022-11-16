import { BreakoutDataType, postBreakout } from "../db/breakoutsEntity";
import { getLatestConfig, postConfig } from "../db/configsEntity";
import { getDailyRun, postDailyRun, putDailyRun } from "../db/dailyRunsEntity";
import { getTicker, postTicker } from "../db/tickersEntity";
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

const isNotebookIdle = (sessions: [{ path: string, kernel: { execution_state: string } }]) => {
  const matchedSession = sessions.find(session => session.path.indexOf("get_todays_picks") > -1);
  return matchedSession?.kernel.execution_state === "idle"
}

export const triggerDailyrun = async () => {
  const sessions = await getSessions();
  const isIdle = isNotebookIdle(sessions);

  if (!isIdle) {
    return Promise.reject(new Error("Process is not idle. Could be due to previous execution is still ongoing."));
  }

  const resp = await triggerDailyRun();
  const runId = resp.split('\n')[0].replace("run_id= ", "")
  await postDailyRun(runId);
  return Promise.resolve(runId);
}

const isConfigDifferent = (latestConfig: Config, config: Config) => {

  const configEntities = Object.keys(config);
  const latestConfigEntities = Object.keys(latestConfig);

  // Note: since latest config (the ones existing in Frestore) always get their _ref prop extended to iteself, the difference between incoming config and existing config should be 1, if objects are identical.
  if ((latestConfigEntities.length - configEntities.length) !== 1) {
    return false
  }

  const foundMissmatches = configEntities.reduce((result: any, configName) => {
    return result + latestConfig[configName] !== config[configName];
  }, 0);
  return !!foundMissmatches;
}

export const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  console.log("pretend to store dailyRunData:", dailyRunBody)
  console.log("...just the breakouts:", dailyRunBody.breakouts)

  const { runId, runTime, config, breakouts } = dailyRunBody;

  // update DailyRun 
  let dailyRun = await getDailyRun(runId);

  if (!dailyRun) {
    dailyRun = await postDailyRun(runId);
  }

  await putDailyRun(dailyRun._ref, {
    ...dailyRun,
    status: "completed",
    duration: runTime,
    timeEnded: Date.now(),
  });

  // Get/Post config
  const newConfig = {
    ...config,
    timestamp: Date.now(),
  };
  const latestConfig = await getLatestConfig();
  let configRef: string = latestConfig?._ref;
  if (!configRef || isConfigDifferent(latestConfig, newConfig)) {
    const { _ref } = await postConfig(newConfig);
    configRef = _ref;
  }

  breakouts.forEach(async breakout => {
    const { relative_strength, breakout_level, image, symbol } = breakout;

    // Get/Post Ticker for each breakout item
    const ticker = await getTicker(symbol);
    let tickerRef = ticker?._ref;
    if (!tickerRef) {
      const ticker = await postTicker(symbol);
      tickerRef = ticker._ref;
    }

    // Post Breakout for each breakout item
    const breakoutData: BreakoutDataType = {
      dailyRunRef: dailyRun._ref,
      configRef,
      tickerRef,
      relativeStrength: relative_strength,
      breakoutValue: breakout_level,
      image
    };
    await postBreakout(breakoutData);
  })

  return;
};