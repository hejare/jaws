import type { NextApiRequest, NextApiResponse } from "next";
import {getSharks} from "./db"

interface SharksData {
  name: string,
  size: string
}

type Data = {
  sharks: SharksData[];
};

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
  ) {

    const resp: SharksData[] = await getSharks()
    res.status(200).json({ sharks: resp });
  }
  

