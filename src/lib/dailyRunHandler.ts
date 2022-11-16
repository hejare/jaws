import { postDailyRun } from "../services/firestoreService";
import { getSessions, triggerDailyRun } from "../services/sharksterService";

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