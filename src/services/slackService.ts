import fetch from "node-fetch";
import { BodyInit } from "node-fetch";
import { convertResult } from "../util/convertResult";

export const postSlackMessage = async () => {
  const scarySharkImgUrl =
    "https://static.nationalgeographic.co.uk/files/styles/image_3200/public/shark-scary-animals.jpg?w=1600";

  const body: BodyInit = JSON.stringify({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Time for your daily picks!! \n <https://jaws-sharkster.netlify.app/daily-run|Link to daily run>",
        },
        accessory: {
          type: "image",
          image_url: scarySharkImgUrl,
          alt_text: "scary shark",
        },
      },
    ],
  });

  const resp = await fetch(
    `https://hooks.slack.com/services/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`,
    { method: "POST", body },
  );

  return convertResult(resp);
};
