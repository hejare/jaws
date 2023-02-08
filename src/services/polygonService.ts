import { getTodayWithDashes } from "@jaws/lib/helpers";
import { ITrades, restClient } from "@polygon.io/client-js";

export enum MADays {
  TEN = 10,
  TWENTY = 20,
  FIFTY = 50,
}

const { POLYGON_KEY = "[NOT_DEFINED_IN_ENV]" } = process.env;

const polygonRestAPI = restClient(POLYGON_KEY);

export const getLastTradesMedianPrice = async (symbol: string) => {
  return polygonRestAPI.stocks
    .trades(symbol, {
      timestamp: getTodayWithDashes(),
      limit: 10,
    })
    .then(({ results }: ITrades) => {
      if (!results) {
        return null;
      }
      const prices = results.map(({ price }) => price);
      prices.sort((a, b) => a - b);

      if (prices.length % 2) {
        // odd length:
        return prices[(prices.length - 1) / 2];
      }
      // even length:
      return prices[prices.length / 2 - 1];
    });
};

/* node-fetch since polygonClient doesn't have support for this endpoint */
export const getSimpleMovingAverage = async (
  symbol: string,
  timeRange: MADays,
) => {
  const data = await polygonRestAPI.stocks.sma(symbol, {
    timespan: "day",
    adjusted: true,
    window: timeRange,
    series_type: "close",
    order: "desc",
    limit: 1,
  });

  const value = data.results?.values?.[0].value;

  if (!value) {
    throw new Error(
      `Could not get SMA for ${symbol}. Response: ${JSON.stringify(data)}`,
    );
  }
  return value;
};
