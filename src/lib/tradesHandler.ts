import {
  deleteTrade,
  getTradeByOrderId,
  getTradesByStatus,
  postTrade,
  putTrade,
} from "../db/tradesEntity";
import { TradesDataType, TRADE_STATUS, TRADE_SIDE } from "../db/tradesMeta";
import {
  getLastTradePrice,
  getSimpleMovingAverage,
} from "../services/polygonService";
import * as alpacaService from "../services/alpacaService";
import { AlpacaOrderStatusType } from "../services/alpacaMeta";
import { isToday } from "./helpers";

interface ExtendedTradesDataType extends TradesDataType {
  lastTradePrice?: number | null;
  movingAvg10?: number;
  sold?: number;
}

export const isPriceWithinBuyRange = (
  currentPrice: number,
  targetPrice: number,
) => {
  // Allow 1% range to trigger buy
  return currentPrice > targetPrice * 1.0 && currentPrice < targetPrice * 1.01;
};

export const triggerBuyOrders = async () => {
  // Get all "READY" orders:
  const trades = await getTradesByStatus(TRADE_STATUS.READY);

  const promises: Promise<number | null>[] = [];
  trades.forEach((trade) => {
    promises.push(getLastTradePrice(trade.ticker));
  });
  const marketPrices = await Promise.all(promises);

  const AlpacaTradePromises: Promise<void>[] = [];
  trades.forEach((trade, i) => {
    const { price, ticker, quantity } = trade;
    const marketPrice = marketPrices[i];
    if (marketPrice && isPriceWithinBuyRange(marketPrice, price)) {
      // Send order to alpaca:
      AlpacaTradePromises.push(
        alpacaService
          .postNewBuyOrder(ticker, price, quantity)
          .then(async (result) => {
            const placed = Date.parse(result.created_at); // result.created_at: '2022-12-05T11:02:02.058370387Z'
            console.log("ALPACA ORDER DONE:", result);
            await putTrade({
              ...trade,
              status: TRADE_STATUS.ACTIVE,
              alpacaOrderId: result.id,
              placed,
            }).catch((e) => {
              console.log(e);
            });
          })
          .catch((e) => {
            console.log(e);
          }),
      );
    }
  });
  await Promise.all(AlpacaTradePromises);
  return trades.map((t, i) => ({ ...t, marketPrice: marketPrices[i] }));
};

export const deleteActiveOrder = async (orderId: string) => {
  await alpacaService.deleteOrder(orderId).catch((e) => {
    console.log(e);
  });
  const existingTrade = await getTradeByOrderId(orderId);
  if (existingTrade && existingTrade.status === TRADE_STATUS.ACTIVE) {
    await deleteTrade(existingTrade.breakoutRef).catch((e) => {
      console.log(e);
    });
  }
};

export const triggerUpdateBuyOrders = async () => {
  // Get all "ACTIVE" & "PARTIALLY_FILLED" orders:
  const activeTrades = await getTradesByStatus(TRADE_STATUS.ACTIVE);
  const partiallyFilledTrades = await getTradesByStatus(
    TRADE_STATUS.PARTIALLY_FILLED,
  );

  const orderIds = activeTrades.map(({ alpacaOrderId }) => alpacaOrderId);
  const orders = await alpacaService.getTodaysOrders();

  const TradesPromises: Promise<void>[] = [];
  activeTrades.forEach((trade) => {
    const existingTrades = orders.find(
      ({ id }: { id: string }) => id === trade.alpacaOrderId,
    );
    if (existingTrades.status === AlpacaOrderStatusType.FILLED) {
      TradesPromises.push(
        putTrade({
          ...trade,
          status: TRADE_STATUS.FILLED,
        }).catch((e) => {
          console.log(e);
        }),
      );
    } else if (
      existingTrades.status === AlpacaOrderStatusType.PARTIALLY_FILLED
    ) {
      TradesPromises.push(
        putTrade({
          ...trade,
          status: TRADE_STATUS.PARTIALLY_FILLED,
        }).catch((e) => {
          console.log(e);
        }),
      );
    }
  });
  partiallyFilledTrades.forEach((trade) => {
    const existingTrades = orders.find(
      ({ id }: { id: string }) => id === trade.alpacaOrderId,
    );
    if (existingTrades.status === AlpacaOrderStatusType.FILLED) {
      TradesPromises.push(
        putTrade({
          ...trade,
          status: TRADE_STATUS.FILLED,
        }).catch((e) => {
          console.log(e);
        }),
      );
    }
  });
  await Promise.all(TradesPromises);
  return { activeTrades, partiallyFilledTrades, orderIds, orders };
};

export const triggerClearOldBuyOrders = async () => {
  // Get all "READY" and "ACTIVE" orders:
  const readyTrades = await getTradesByStatus(TRADE_STATUS.READY);
  const activeTrades = await getTradesByStatus(TRADE_STATUS.ACTIVE);

  // Delete all old ones:
  const promises: Promise<void>[] = [];
  readyTrades.forEach((trade) => {
    if (!isToday(trade.created)) {
      promises.push(deleteTrade(trade.breakoutRef));
    }
  });
  activeTrades.forEach((trade) => {
    if (!isToday(trade.created)) {
      promises.push(deleteTrade(trade.breakoutRef));
    }
  });
  await Promise.all(promises);
  return { readyTrades };
};

export const isStopLossOrder = (
  trade: ExtendedTradesDataType,
  stopLossLimit: number,
) => {
  const lastTradePrice = trade.lastTradePrice;
  if (!lastTradePrice) return false;
  const movingAvg = trade.movingAvg10;
  if (trade.price - lastTradePrice >= stopLossLimit) return true;
  if (movingAvg && lastTradePrice <= movingAvg) return true; // ? <= or < ?
  return false;
};

/* After 10% increase in value, we take profit */
const isTakeProfitOrder = (trade: ExtendedTradesDataType) => {
  if (trade.status == TRADE_STATUS.TAKE_PROFIT) return false;
  const lastTradePrice = trade.lastTradePrice;
  return lastTradePrice && trade.price * 1.1 <= lastTradePrice;
};

const depopulateTrade = (trade: ExtendedTradesDataType): TradesDataType => {
  delete trade.lastTradePrice;
  delete trade.movingAvg10;
  return trade;
};

const updateTrade = async (trade: ExtendedTradesDataType) => {
  const depopulatedTrade = depopulateTrade(trade);
  try {
    await putTrade(depopulatedTrade);
  } catch (e) {
    console.log(e);
    throw Error(`${e as string}`);
  }
};

const handleTakeProfitOrder = async (trade: ExtendedTradesDataType) => {
  try {
    const result = await alpacaService.takeProfitSellOrder(
      trade.ticker,
      trade.quantity,
    );
    const originalTradeEntity = depopulateTrade(trade);

    await putTrade({
      ...originalTradeEntity,
      quantity: trade.quantity - result.qty,
      status: TRADE_STATUS.TAKE_PROFIT,
    });
  } catch (e) {
    console.log(e);
    throw Error(`Error when handling take-profit-order ${e as string}`);
  }
};

export const performActions = (
  trades: ExtendedTradesDataType[],
  stopLossLimit: number,
) => {
  const messageArray: string[] = [];
  trades.forEach((trade) => {
    const { ticker, breakoutRef } = trade;
    if (isStopLossOrder(trade, stopLossLimit)) {
      void alpacaService.stopLossSellOrder(trade.ticker);
      messageArray.push(`Stop loss ${ticker}: breakoutRef: ${breakoutRef}`);
      void updateTrade({
        ...trade,
        status: TRADE_STATUS.CLOSED,
        sold: Date.now(),
      });
    } else if (isTakeProfitOrder(trade)) {
      void handleTakeProfitOrder(trade);
      messageArray.push(`Take profit ${ticker}: breakoutRef: ${breakoutRef}`);
    }
  });

  messageArray.length < 1 &&
    messageArray.push("No stop loss or take profit performed");
  return messageArray;
};

async function populateTradesData(trades: TradesDataType[]) {
  const populatedArray: ExtendedTradesDataType[] = [];
  await Promise.all(
    trades.map(async (trade) => {
      const lastTradePrice = await getLastTradePrice(trade.ticker);
      const movingAvg10 = await getSimpleMovingAverage(trade.ticker, 10);
      populatedArray.push({ ...trade, lastTradePrice, movingAvg10 });
    }),
  );
  return populatedArray;
}

export const triggerStopLossTakeProfit = async () => {
  try {
    const filledTrades = await getTradesByStatus(TRADE_STATUS.FILLED);

    const [newFilledTrades, balance] = await Promise.all([
      populateTradesData(filledTrades),
      alpacaService.getPortfolioValue(),
    ]);
    const stopLossLimit = balance * 0.005; // 0.5% of total value
    return performActions(newFilledTrades, stopLossLimit);
  } catch (e) {
    console.log(e);
    throw Error(`Unable to handle stop-loss & take-profit ${e as string}`);
  }
};
