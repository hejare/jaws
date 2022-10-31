import { AnyARecord } from "dns";
import fetch from "node-fetch";
import { Response } from "node-fetch";

const convertResult = async (result: Response) => {
  console.log(result);
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const brokerService = async () => {
  const resp = await fetch(`http://localhost:3000/api/broker/place-order`);
  const data = await convertResult(resp);
  console.log("data ", data);
};

export const handlePostOrder = async (ticker: string) => {
  const resp = await fetch(`http://localhost:3000/api/broker/place-order/?ticker=${ticker}`, {method: 'POST'});
  const data = await convertResult(resp);
  console.log("data ", data);
}