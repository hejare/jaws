import { TradesDataType, TRADE_SIDE, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { getBuySellHelpers } from "@jaws/lib/buySellHelper/buySellHelper";
import { AlpacaOrderStatusType } from "@jaws/services/alpacaMeta";
import * as alpacaService from "@jaws/services/alpacaService";
import {
  deleteTrade,
  getTradeByOrderId,
  getTradesByStatus,
  putTrade,
} from "../db/tradesEntity";
import {
  getLastTradePrice,
  getSimpleMovingAverage,
} from "../services/polygonService";
import { isToday } from "./helpers";

interface ExtendedTradesDataType extends TradesDataType {
  lastTradePrice: number;
  movingAvg: number;
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

const depopulateTrade = (trade: ExtendedTradesDataType): TradesDataType => {
  const { lastTradePrice, movingAvg, ...depopTrade } = trade;
  return depopTrade;
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

export const performActions = (
  trades: ExtendedTradesDataType[],
  stopLossLimit: number,
) => {
  const messageArray: string[] = [];
  trades.forEach((trade) => {
    const { ticker, breakoutRef } = trade;
    const buySellHelpers = getBuySellHelpers();
    const newTradeStatus = buySellHelpers.determineTradeStatus({
      trade,
      stopLossMaxAmount: stopLossLimit,
      lastTradePrice: trade.lastTradePrice,
      movingAvg: trade.movingAvg,
    });

    if (!newTradeStatus) {
      // Stock hasn't triggered any of our stop-loss/take profit rules
      return;
    }

    if (
      [
        TRADE_STATUS.STOP_LOSS_1,
        TRADE_STATUS.STOP_LOSS_2,
        TRADE_STATUS.STOP_LOSS_3,
      ].includes(newTradeStatus)
    ) {
      void handleStopLossOrder(trade, newTradeStatus);
      messageArray.push(`Stop loss ${ticker}: breakoutRef: ${breakoutRef}`);
    } else if (TRADE_STATUS.PARTIAL_PROFIT_TAKEN === newTradeStatus) {
      void handleTakePartialProfitOrder(trade);
      messageArray.push(`Take profit ${ticker}: breakoutRef: ${breakoutRef}`);
    }
  });

  messageArray.length < 1 &&
    messageArray.push("No stop loss or take profit performed");
  return messageArray;
};

async function handleStopLossOrder(
  trade: ExtendedTradesDataType,
  newTradeStatus: TRADE_STATUS,
) {
  try {
    await alpacaService.stopLossSellOrder(trade.ticker, trade.quantity);

    await updateTrade({
      ...trade,
      status: newTradeStatus,
      sold: Date.now(),
    });
  } catch (e) {
    console.log(e);
    throw Error(`Error when handling stop-loss order ${e as string}`);
  }
}

const handleTakePartialProfitOrder = async (trade: ExtendedTradesDataType) => {
  try {
    const sellQuantity = Math.ceil(
      trade.quantity *
        getBuySellHelpers().config.TAKE_PARTIAL_PROFIT_SELL_PERCENTAGE,
    );

    const result = await alpacaService.takePartialProfitSellOrder(
      trade.ticker,
      sellQuantity,
    );
    await putTrade({
      ...depopulateTrade(trade),
      quantity: trade.quantity - parseInt(result.qty),
      status: TRADE_STATUS.PARTIAL_PROFIT_TAKEN,
    });
  } catch (e) {
    console.log(e);
    throw Error(`Error when handling take-partial-profit order ${e as string}`);
  }
};

async function populateTradesData(trades: TradesDataType[]) {
  const populatedArray: ExtendedTradesDataType[] = [];
  await Promise.all(
    trades.map(async (trade) => {
      const lastTradePrice = await getLastTradePrice(trade.ticker);
      const movingAvg = await getSimpleMovingAverage(
        trade.ticker,
        getBuySellHelpers().config.MOVING_AVERAGE_DAY_RANGE,
      );
      populatedArray.push({ ...trade, lastTradePrice, movingAvg });
    }),
  );
  return populatedArray;
}

export const triggerStopLossTakeProfit = async () => {
  try {
    const filledTrades = await getTradesByStatus(
      TRADE_STATUS.FILLED,
      TRADE_STATUS.PARTIAL_PROFIT_TAKEN,
    );

    const buySellHelper = getBuySellHelpers();

    const [newFilledTrades, balance] = await Promise.all([
      populateTradesData(filledTrades),
      alpacaService.getPortfolioValue(),
    ]);

    const stopLossLimit = buySellHelper.getStopLossMaxAmount(
      parseFloat(balance),
    );

    return performActions(newFilledTrades, stopLossLimit);
  } catch (e) {
    console.log(e);
    throw Error(`Unable to handle stop-loss & take-profit ${e as string}`);
  }
};
