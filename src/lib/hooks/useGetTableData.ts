import { TRADE_STATUS } from "@jaws/db/tradesMeta";
import {
  getAccountAssets,
  getAccountCashBalance,
} from "@jaws/services/backendService";
import { RawPosition } from "@master-chief/alpaca/@types/entities";
import { useEffect, useState } from "react";

export interface PortfolioTableAsset extends RawPosition {
  percent_of_total_assets: number;
  change_since_entry?: number;
  stop_loss_type: TRADE_STATUS;
  stop_loss_price: number;
  take_partial_profit_price: number;
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
    Promise.all([getAccountAssets(), getAccountCashBalance()])
      .then(([assetsResult, balance]) => {
        const assets = assetsResult.assets;

        const tableData = convertToTableData({
          assets,
          balance: parseFloat(balance),
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
}: {
  assets: RawPosition[];
  balance: number;
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

  const extendedAssets: PortfolioTableAsset[] = assets.map((a) => {
    // const buySellHelpers = getBuySellHelpers();
    // const sellPriceLevels = buySellHelpers.getSellPriceLevels({});

    return {
      ...a,
      percent_of_total_assets:
        ((parseFloat(a.avg_entry_price) * parseFloat(a.qty)) /
          totalPortfolioValue) *
        100,
      change_since_entry: a.current_price
        ? (parseFloat(a.current_price) - parseFloat(a.avg_entry_price)) /
          parseFloat(a.avg_entry_price)
        : undefined,
    };
  }) as any;

  return {
    investedValue,
    marketValue,
    assets: extendedAssets,
    totalPortfolioValue,
  };
}

// function positionToTrade(position: RawPosition): TradesDataType {
//   return {
//     breakoutRef: "FAKE",
//   };
// }
