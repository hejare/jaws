import {
  deleteTrade,
  getTradeByOrderId,
  getTradesByStatus,
  putTrade,
} from "../db/tradesEntity";
import { TRADE_STATUS } from "../db/tradesMeta";
import { getLastTradePrice } from "../services/polygonService";
import * as alpacaService from "../services/alpacaService";
import { AlpacaOrderStatusType, Side } from "../services/alpacaMeta";
import { isToday } from "./helpers";

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
          .postOrder(ticker, Side.BUY, price, quantity)
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
  // Get all "READY" orders:
  const readyTrades = await getTradesByStatus(TRADE_STATUS.READY);

  const promises: Promise<void>[] = [];
  readyTrades.forEach((trade) => {
    if (!isToday(trade.created)) {
      promises.push(deleteTrade(trade.breakoutRef));
    }
  });
  await Promise.all(promises);
  return { readyTrades };
};
