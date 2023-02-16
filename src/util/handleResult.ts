import { Response } from "node-fetch";

export const convertResult = async <T = any>(result: Response): Promise<T> => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text as any;
  }
};

export const handleResult = async <T = any>(result: Response) => {
  const data = await convertResult<T>(result);

  return result.ok ? Promise.resolve(data) : Promise.reject(data);
};
