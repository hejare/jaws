import fetch from "node-fetch";
import { convertResult } from "../util";

export const postSlackMessage = async () => {

  const resp = await fetch(
    `/api/slack/slack`,
    {
      method: "POST",
    },
  );

  return convertResult(resp);
};
