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
  try {
    const data = await convertResult<T>(result);
    const reason = { error: data };
    return result.ok
      ? await Promise.resolve(data)
      : await Promise.reject(reason);
  } catch (error) {
    const reason = { error };
    return Promise.reject(reason);
  }
};
