import fetch from "node-fetch";
import { BodyInit } from "node-fetch";
import { convertResult } from "../util/convertResult";

export const postSlackMessage = async () => {
  const body: BodyInit = JSON.stringify({ text: "From Jaws app!" });

  const resp = await fetch(
    `https://hooks.slack.com/services/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`,
    { method: "POST", body },
  );

  return convertResult(resp);
};
