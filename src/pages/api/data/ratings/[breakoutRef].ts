import type { NextApiRequest, NextApiResponse } from "next";
import { getRating, postRating, putRating } from "../../../../db/ratingsEntity";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { query, method, body } = req;
  const { breakoutRef } = query;

  if (typeof breakoutRef !== "string") {
    return res.status(404).json({});
  }

  const results = {};
  try {
    switch (method) {
      case "POST":
        const { userRef, value } = body;
        const existingRating = await getRating(breakoutRef, userRef);

        if (existingRating?._ref) {
          await putRating(existingRating._ref, { breakoutRef, userRef, value });
        } else {
          await postRating({ breakoutRef, userRef, value });
        }
        break;
      default:
        throw new Error(`Unsupported method: ${method as string}`);
    }
  } catch (e) {
    let message;
    if (e instanceof Error) {
      message = e.message;
      if (typeof e.message !== "string") {
        message = e;
      }
    }
    res.status(500).json({ status: "NOK", message });
  }

  res.status(200).json(results);
}
