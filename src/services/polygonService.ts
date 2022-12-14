import {
  ILastTrade,
  ITrades,
  polygonClient,
  restClient,
} from "@polygon.io/client-js";
import fetch from "node-fetch";
import { getTodayWithDashes } from "../lib/helpers";
import { handleResult } from "../util";

export enum MADays {
  TEN = 10,
  FIFTY = 50,
}

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
//https://polygon.io/docs/stocks/get_v1_indicators_sma__stockticker#:~:text=1605195918306274000%0A%20%20%20%20%7D%0A%7D-,Simple%20Moving%20Average%20(SMA),-GET
export const getMovingAverage = async (symbol: string, timeRange: MADays) => {
  const url = `https://api.polygon.io/v1/indicators/sma/${symbol}?timespan=day&adjusted=true&window=${timeRange}&series_type=close&order=desc&limit=1&apiKey=${POLYGON_KEY}`;
  const response = await fetch(url);
  const data = await handleResult(response);
  return data.results.values[0].value;
  // polygonClient doesn't have support for this endpoint?
};
