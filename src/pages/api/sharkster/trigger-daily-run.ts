import type { NextApiRequest, NextApiResponse } from "next";
import { getSessions, triggerDailyRun } from "../../../services/sharksterService";
import { postDailyRun, postBreakout, postTicker, postConfig } from "../../../services/firestoreService";

const isNotebookIdle = (sessions: [{ path: string, kernel: { execution_state: string } }]) => {
  const matchedSession = sessions.find(session => session.path.indexOf("get_todays_picks") > -1);
  return matchedSession?.kernel.execution_state === "idle"
}

type ResponseDataType = {
  status: string;
  message?: string;
  meta?: {};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  try {
    const responseData: ResponseDataType = { status: "INIT" };
    switch (method) {
      case "GET":
        const sessions = await getSessions();
        const isIdle = isNotebookIdle(sessions);

        if (isIdle) {
          const resp = await triggerDailyRun();
          const runId = resp.split('\n')[0].replace("run_id= ", "")
          await postDailyRun(runId);
          await postBreakout(runId)  // TODO breakouts related to daily run to DB (needs to reference a ticker & a config)


          // ? post ticker and config from here given the daily run data? Or is the ticker and config posted to DB somewhere else?
          // await postTicker()
          // await postConfig()

          responseData.status = "OK";
          responseData.meta = { runId, resp };
        } else {
          responseData.status = "NOK";
          responseData.message = "Process is not idle. Could be due to previous execution is still ongoing.";
          responseData.meta = { sessions };
        }
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    res.status(200).json(responseData);
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    console.error(message);
    return res.status(500).json({
      error: message,
    });
  }
}
