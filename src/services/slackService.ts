import fetch from "node-fetch";
import { convertResult, hostUrl } from "../util";

export const postSlackMessage = async () => {
  const baseUrl = hostUrl()

  const resp = await fetch(
    `${baseUrl}/api/slack/slack`,
    {
      method: "POST",
    },
  );

  return convertResult(resp);
};
