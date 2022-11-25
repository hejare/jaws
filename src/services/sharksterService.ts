import fetch from "node-fetch";
import { convertResult } from "../util";

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
  const resp = await fetch(
    `${SERVICE_SHARKSTER_API_BASE_URL}/breakouts?runId=${runId}`,
  );

  return convertResult(resp);
};

export const checkDailyRunIdle = async () => {
  const resp = await fetch(`${SERVICE_SHARKSTER_API_BASE_URL}/breakouts/idle`);
  const text = await convertResult(resp);

  const isIdle = text.indexOf("idle") > -1;
  return { isIdle, text };
};

// TODO: Add check health status for endpoints via this: http://3.84.38.201:8889/_api/spec/swagger.json
// TODO: Add check health status for endpoints via this: http://3.84.38.201:8889/_api/spec/swagger.json
// TODO: Add check health status for endpoints via this: http://3.84.38.201:8889/_api/spec/swagger.json
