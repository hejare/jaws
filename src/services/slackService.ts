import fetch from "node-fetch";
import { BodyInit } from "node-fetch";
import { convertResult } from "../util/convertResult";

export const postSlackMessage = async () => {

  const resp = await fetch(
    `http://localhost:3000/api/slack/slack`,
    {
      method: "POST",
    },
  );

  return convertResult(resp);
};
