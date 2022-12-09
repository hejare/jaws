import {
  ILastTrade,
  ITrades,
  polygonClient,
  restClient,
} from "@polygon.io/client-js";
import { getTodayWithDashes } from "../lib/helpers";

const { POLYGON_KEY = "[NOT_DEFINED_IN_ENV]" } = process.env;

const polygonRestAPI = restClient(POLYGON_KEY);

export const getLastTradePrice = async (symbol: string) => {
  return polygonRestAPI.stocks
    .lastTrade(symbol)
    .then(({ results }: ILastTrade) => results?.p || null);
};

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
