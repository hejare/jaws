import nodeFetch from "node-fetch";
import { convertResult } from "../util";

export const fetch = async (url: string) => {
  const resp = await nodeFetch(url);

  return convertResult(resp);
};
