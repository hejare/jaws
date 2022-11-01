import { Response } from "node-fetch";

export const convertResult = async (result: Response) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
