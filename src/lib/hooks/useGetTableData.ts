import { TradesDataType, TRADE_STATUS } from "@jaws/db/tradesMeta";
import {
  getAccountAssets,
  getAccountCashBalance,
  getJawsPortfolio,
  getMovingAverages,
} from "@jaws/services/backendService";
import { RawPosition } from "@master-chief/alpaca/@types/entities";
import { useEffect, useState } from "react";
import { getBuySellHelpers } from "../buySellHelper/buySellHelper";

export interface PortfolioTableAsset extends TradesDataType {
  percentOfTotalAssets: number;
  changeSinceEntry: number;
  stopLossType: TRADE_STATUS;
  stopLossPrice: number;
  takePartialProfitPrice: number;
  avgEntryPrice: number;
  value: number;
  currentPrice: number;
  changeToday: number;
  movingAvg: number;
  takenPartialProfit: boolean;
}

export const useGetTableData = () => {
  const [fetchStatus, setFetchStatus] = useState<"loading" | "ok">("loading");
  const [data, setData] = useState<{
    assets: PortfolioTableAsset[];
    investedValue: number;
    marketValue: number;
    totalPortfolioValue: number;
  }>({} as any);

  useEffect(() => {
    Promise.all([
      getAccountAssets(),
      getAccountCashBalance(),
      getJawsPortfolio(),
    ])
      .then(async ([assetsResult, balance, trades]) => {
        const assets = assetsResult.assets;

        const movingAverages = await getMovingAverages(
          assets.map((a) => a.symbol),
        );

        const sortedData = trades.map((trade) => ({
          trade,
          movingAvg: movingAverages.find((ma) => ma.symbol === trade.ticker)
            ?.ma,
          alpacaAsset: assets.find((a) => a.symbol === trade.ticker),
        })) as {
          trade: TradesDataType;
          movingAvg: number;
          alpacaAsset: RawPosition;
        }[];

        const tableData = convertToTableData({
          assets,
          balance: parseFloat(balance),
          data: sortedData,
        });

        setData(tableData);
        setFetchStatus("ok");
      })
      .catch(console.error);
  }, []);

  return { fetchStatus, ...data };
};

function convertToTableData({
  assets,
  balance,
  data,
}: {
  assets: RawPosition[];
  balance: number;
  data: {
    trade: TradesDataType;
    movingAvg: number;
    alpacaAsset: RawPosition;
  }[];
}): {
  marketValue: number;
  investedValue: number;
  assets: PortfolioTableAsset[];
  totalPortfolioValue: number;
} {
  const investedValue = assets.reduce(
    (sum: number, { cost_basis }) => sum + parseFloat(cost_basis),
    0,
  );

  const marketValue: number = assets.reduce(
    (sum: number, { market_value }) =>
      sum + (market_value ? parseFloat(market_value) : 0),
    0,
  );

  const totalPortfolioValue = balance + marketValue;

  const extendedAssets: PortfolioTableAsset[] = data.map(
    ({ trade, alpacaAsset, movingAvg }) => {
      if (!alpacaAsset.current_price) {
        throw new Error("Missing data!");
      }

      const avgEntryPrice = parseFloat(alpacaAsset.avg_entry_price);
      const currentPrice = parseFloat(alpacaAsset.current_price);

      const buySellHelpers = getBuySellHelpers();
      const sellPriceLevels = buySellHelpers.getSellPriceLevels({
        trade,
        lastTradePrice: currentPrice,
        movingAvg,
        totalAssets: totalPortfolioValue,
      });

      const stopLossType = [
        TRADE_STATUS.STOP_LOSS_1,
        TRADE_STATUS.STOP_LOSS_2,
        TRADE_STATUS.STOP_LOSS_3,
      ].find((sl) => sellPriceLevels[sl] !== undefined) as TRADE_STATUS;

      return {
        ...trade,
        percentOfTotalAssets:
          ((avgEntryPrice * trade.quantity) / totalPortfolioValue) * 100,
        changeSinceEntry: (currentPrice - avgEntryPrice) / avgEntryPrice,
        value: trade.quantity * currentPrice,
        currentPrice,
        avgEntryPrice,
        changeToday: Number(alpacaAsset.change_today),
        stopLossPrice: sellPriceLevels[stopLossType] as number,
        stopLossType,
        takePartialProfitPrice: sellPriceLevels.PARTIAL_PROFIT_TAKEN as number,
        movingAvg,
        takenPartialProfit: trade.status === TRADE_STATUS.PARTIAL_PROFIT_TAKEN,
      };
    },
  );

  return {
    investedValue,
    marketValue,
    assets: extendedAssets,
    totalPortfolioValue,
  };
}