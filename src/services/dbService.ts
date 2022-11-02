
import fetch from "node-fetch";
import { convertResult } from "../util";

export const getSharks = async () => {

  const resp = await fetch(
    `/api/db/get-sharks`,
  );

  return convertResult(resp);
};
