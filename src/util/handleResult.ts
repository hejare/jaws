import { Response } from "node-fetch";

export const convertResult = async (result: Response) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const handleResult = async (result: Response) => {
  try {
    const data = await convertResult(result);
    const reason = { error: data };
    return result.ok ? await Promise.resolve(data) : await Promise.reject(reason);
  } catch (error) {
    const reason = { error };
    return Promise.reject(reason);
  }
};