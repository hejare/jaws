import { getDailyRun, postBreakout, postDailyRun, putDailyRun } from "../services/firestoreService";
import { getSessions, triggerDailyRun } from "../services/sharksterService";

interface Ticker {
  ticker: string;
  price: number;
}

type DailyRunBody = {
  runId: string;
  runTime: number;
  breakouts: Ticker[];
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

  // Get/Post Ticker for each breakout item

  // Post Breakout for each breakout item
  await postBreakout(runId)  // TODO breakouts related to daily run to DB (needs to reference a ticker & a config)

  return;
};