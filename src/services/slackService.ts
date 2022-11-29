import fetch, { BodyInit } from "node-fetch";
import { formatDateString } from "../util/handleFormatDateString";

const { SLACK_WEBHOOK_API_KEY = "[NOT_DEFINED_IN_ENV]" } = process.env;

export const postSlackMessage = async (runId: string) => {
  const [unformatedDate, unformatedTime] = runId.split("_");

  // 131023 -> 13:10
  const time = `${unformatedTime.substring(0, 2)}:${unformatedTime.substring(
    2,
    4,
  )}`;

  // 20221124 -> 2022-11-24
  const date = formatDateString(unformatedDate);

  const body: BodyInit = JSON.stringify({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Time to check out todays run! \n <https://jaws-sharkster.netlify.app/daily-runs/${unformatedDate}/${unformatedTime}|Daily run for ${date} at ${time}>`,
        },
      },
    ],
  });

  await fetch(`https://hooks.slack.com/services/${SLACK_WEBHOOK_API_KEY}`, {
    method: "POST",
    body,
  });
};
