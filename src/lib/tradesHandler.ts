import {
  deleteTrade,
  getTradeByOrderId,
  getTradesByStatus,
  putTrade,
} from "../db/tradesEntity";
import { TradesDataType, TRADE_SIDE, TRADE_STATUS } from "../db/tradesMeta";
import { AlpacaOrderStatusType } from "../services/alpacaMeta";
import * as alpacaService from "../services/alpacaService";
import {
  getLastTradePrice,
  getSimpleMovingAverage,
} from "../services/polygonService";
import { isToday } from "./helpers";

interface ExtendedTradesDataType extends TradesDataType {
  lastTradePrice?: number | null;
  movingAvg10?: number;
  sold?: number;
}

export const triggerBuyOrders = async () => {
  // Get all "READY" orders:
  const trades = await getTradesByStatus(TRADE_STATUS.READY);

  const AlpacaTradePromises: Promise<void>[] = [];

  trades.forEach((trade) => {
    const { price, ticker, quantity } = trade;

    AlpacaTradePromises.push(
      alpacaService
        .postBuyBreakoutOrder({ ticker, price, quantity })
        .then((result) => {
          const placedTimestamp = Date.parse(result.created_at);
          console.log("ALPACA ORDER DONE:", result);

          return putTrade({
            ...trade,
            status: TRADE_STATUS.ACTIVE,
            alpacaOrderId: result.id,
            placed: placedTimestamp,
          });
        })
        .catch((e) => {
          console.log(e);
        }),
    );
  });

  await Promise.all(AlpacaTradePromises);

  return trades;
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

export const triggerUpdateOpenBuyOrders = async () => {
  // Get all "ACTIVE" & "PARTIALLY_FILLED" orders:
  const activeTrades = await getTradesByStatus(TRADE_STATUS.ACTIVE);
  const partiallyFilledTrades = await getTradesByStatus(
    TRADE_STATUS.PARTIALLY_FILLED,
  );

  const orderIds = activeTrades.map(({ alpacaOrderId }) => alpacaOrderId);

  // TODO: Why today? Why not all by status open?
  const orders = await alpacaService.getTodaysOrders();

  const updateTradesPromises: Promise<void>[] = [];

  activeTrades.forEach((trade) => {
    const alpacaOrder = orders.find(({ id }) => id === trade.alpacaOrderId);

    if (!alpacaOrder) {
      console.error(
        "Order " + trade.breakoutRef + " has no corresponding order in Alpaca",
      );

      return;
    }

    let newStatus: TRADE_STATUS;

    // TODO: what about canceled orders?
    if (alpacaOrder.status === AlpacaOrderStatusType.FILLED) {
      newStatus = TRADE_STATUS.FILLED;
    } else if (alpacaOrder.status === AlpacaOrderStatusType.PARTIALLY_FILLED) {
      newStatus = TRADE_STATUS.PARTIALLY_FILLED;
    } else {
      return;
    }

    updateTradesPromises.push(
      putTrade({ ...trade, status: newStatus }).catch((e) => {
        console.log(e);
      }),
    );
  });

  partiallyFilledTrades.forEach((trade) => {
    const alpacaOrder = orders.find(({ id }) => id === trade.alpacaOrderId);

    if (!alpacaOrder) {
      console.error(
        "Order " + trade.breakoutRef + " has no corresponding order in Alpaca",
      );

      return;
    }

    if (alpacaOrder.status === AlpacaOrderStatusType.FILLED) {
      updateTradesPromises.push(
        putTrade({ ...trade, status: TRADE_STATUS.FILLED }).catch((e) => {
          console.log(e);
        }),
      );
    }
  });

  await Promise.all(updateTradesPromises);
  return { activeTrades, partiallyFilledTrades, orderIds, orders };
};

export const triggerClearOldBuyOrders = async () => {
  // Get all "READY" and "ACTIVE" orders:
  const readyTrades = await getTradesByStatus(TRADE_STATUS.READY);
  const activeTrades = await getTradesByStatus(TRADE_STATUS.ACTIVE);

  // Delete all old ones:
  const promises: Promise<void>[] = [];
  readyTrades.forEach((trade) => {
    if (!isToday(trade.created) && trade.side === TRADE_SIDE.BUY) {
      promises.push(deleteTrade(trade.breakoutRef));
    }
  });
  activeTrades.forEach((trade) => {
    if (!isToday(trade.created) && trade.side === TRADE_SIDE.BUY) {
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

  // Stop loss case (1)
  if (trade.price - lastTradePrice >= stopLossLimit) return true;

  // Stop loss case (2)
  if (movingAvg && lastTradePrice <= movingAvg) return true; // ? <= or < ?

  return false;
};

/** After 10% increase in value, we take profit */
const isTakePartialProfit = (trade: ExtendedTradesDataType) => {
  // TODO: Filter these out earlier
  if (trade.status == TRADE_STATUS.TAKE_PROFIT) {
    return false;
  }

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
    await putTrade({
      ...depopulateTrade(trade),
      quantity: trade.quantity - parseInt(result.qty),
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
      void alpacaService.stopLossSellOrder(trade.ticker, trade.quantity);
      messageArray.push(`Stop loss ${ticker}: breakoutRef: ${breakoutRef}`);

      void updateTrade({
        ...trade,
        status: TRADE_STATUS.CLOSED, // TODO: change to more specific
        sold: Date.now(),
      });
    } else if (isTakePartialProfit(trade)) {
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
