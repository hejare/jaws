import fetch from "node-fetch";
import { convertResult } from "@jaws/util";

const {
  SERVICE_SHARKSTER_NOTEBOOK_BASE_URL = "[NOT_DEFINED_IN_ENV]",
  SERVICE_SHARKSTER_API_BASE_URL = "[NOT_DEFINED_IN_ENV]",
} = process.env;

export const getSessions = async () => {
  const resp = await fetch(
    `${SERVICE_SHARKSTER_NOTEBOOK_BASE_URL}/api/sessions`,
  );

  return convertResult(resp);
};

export const triggerDailyRun = async (runId: string) => {
  return fetch(`${SERVICE_SHARKSTER_API_BASE_URL}/breakouts?runId=${runId}`);
};
