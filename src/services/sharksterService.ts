import fetch from "node-fetch";
import { convertResult } from "../util";

const { SERVICE_SHARKSTER_NOTEBOOK_BASE_URL, SERVICE_SHARKSTER_API_BASE_URL } =
  process.env;

export const getSessions = async () => {
  const resp = await fetch(
    `${SERVICE_SHARKSTER_NOTEBOOK_BASE_URL}/api/sessions`
  );

  return convertResult(resp);
};

export const triggerDailyRun = async () => {
  const resp = await fetch(`${SERVICE_SHARKSTER_API_BASE_URL}/breakouts`);

  return convertResult(resp);
};
