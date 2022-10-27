import { AnyARecord } from "dns";
import fetch from "node-fetch";
import { ResponseType } from "node-fetch";

const convertResult = async (result: ResponseType) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const brokerService = async () => {
  const resp = await fetch(`https://www.dn.se/`);
  const data = await convertResult(resp);
  console.log(data);
};
