/**
 * Extracts the array of values from a specified query param object,
 * e.g.:
 *
 * ?list=1&list=2&list=3 => ["1", "2", "3"]
 *
 * Needed because Netlify incorrectly converts repeated query params to
 * a string like "VAL1, VAL2" instead of an array ["VAL1", "VAL2"].
 */
export const getQueryParamArray = (
  query: Partial<{
    [key: string]: string | string[];
  }>,
  key: string,
): string[] | undefined => {
  const value = query[key];

  return value && typeof value === "string"
    ? value.split(", ")
    : (value as string[]);
};
