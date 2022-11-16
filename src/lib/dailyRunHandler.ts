import { BreakoutDataType, postBreakout } from "../db/breakoutsEntity";
import { postConfig } from "../db/configsEntity";
import { getDailyRun, postDailyRun, putDailyRun } from "../db/dailyRunsEntity";
import { getTicker, postTicker } from "../db/tickersEntity";
import { getSessions, triggerDailyRun } from "../services/sharksterService";

interface Breakout {
  relative_strength: number;
  breakout_level: number;
  image: string;
  symbol: string;
}

type DailyRunBody = {
  runId: string;
  runTime: number;
  breakouts: Breakout[];
  config: {};
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

export const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  console.log("pretend to store dailyRunData:", dailyRunBody)
  console.log("...just the breakouts:", dailyRunBody.breakouts)

  const { runId, runTime, config, breakouts } = dailyRunBody;

  // update DailyRun 
  let dailyRunRef = await getDailyRun(runId);

  if (!dailyRunRef) {
    dailyRunRef = await postDailyRun(runId);
  }

  await putDailyRun(dailyRunRef._ref, {
    ...dailyRunRef,
    status: "completed",
    duration: runTime,
    timeEnded: Date.now(),
  });

  // Get/Post config
  const { _ref: configRef } = await postConfig(dailyRunBody.config);

  dailyRunBody.breakouts.forEach(async breakout => {
    const { relative_strength, breakout_level, image, symbol } = breakout;

    // Get/Post Ticker for each breakout item
    let { _ref: tickerRef } = await getTicker(symbol);
    if (!tickerRef) {
      const ticker = await postTicker(symbol);
      tickerRef = ticker._ref;
    }

    // Post Breakout for each breakout item
    const breakoutData: BreakoutDataType = {
      dailyRunRef,
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