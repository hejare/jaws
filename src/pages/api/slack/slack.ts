import fetch, { BodyInit, Response } from "node-fetch";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    data: Response;
  };

const postSlackMessage = async () => {
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
    `https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK_API_KEY}`,
    {
      method: "POST",
      body,
    },
  );

  return resp
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
  ) {
    let data: Response = await postSlackMessage();
    res.status(200).json({ data: data });
  }
