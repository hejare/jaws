import type { NextPage } from "next";
import { useEffect, useState } from "react";
import AssetsList from "@jaws/components/organisms/AssetsList";
import PageContainer from "@jaws/components/atoms/PageContainer";
import Widget from "@jaws/components/atoms/Widget";
import TextDisplay from "@jaws/components/atoms/TextDisplay";
import WidgetGrid from "@jaws/components/organisms/WidgetGrid";
import { INDICATOR } from "@jaws/lib/priceHandler";
import { BoldText } from "@jaws/components/atoms/BoldText";
import PriceDisplay from "@jaws/components/molecules/PriceDisplay";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import {
  getAccountAssets,
  getAccountCashBalance,
} from "../services/backendService";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const PortfolioPage: NextPage = () => {
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([getAccountAssets(), getAccountCashBalance()])
      .then(([assetsResult, balance]) => {
        // TODO: breakout, test
        const assets = assetsResult.assets;

        const investedValue = assets.reduce(
          (sum: number, { cost_basis }: { cost_basis: string }) =>
            sum + parseFloat(cost_basis),
          0,
        );
        const marketValue: number = assets.reduce(
          (sum: number, { market_value }: { market_value: string }) =>
            sum + parseFloat(market_value),
          0,
        );

        const totalAssets: number = parseFloat(balance) + marketValue;

        setValues([investedValue, marketValue, totalAssets]);

        const extendedAssets = assets.map((a: any) => ({
          ...a,
          percent_of_total_assets:
            ((parseFloat(a.avg_entry_price) * parseFloat(a.qty)) /
              totalAssets) *
            100,
          change_since_entry:
            (parseFloat(a.current_price) - parseFloat(a.avg_entry_price)) /
            parseFloat(a.avg_entry_price),
        }));

        setData(extendedAssets);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  if (dataFetchStatus !== STATUS.READY) {
    return <></>;
  }

  const [investedValue, marketValue, totalAssets] = values;
  const valueDiff = marketValue - investedValue;
  return (
    <PageContainer>
      <WidgetGrid>
        <Widget>
          <TextDisplay>
            <BoldText>Invested</BoldText>
            <div>${investedValue.toFixed()}</div>
          </TextDisplay>
        </Widget>
        <Widget>
          <TextDisplay>
            <BoldText>Market value</BoldText>
            <div>${marketValue.toFixed()}</div>
          </TextDisplay>
        </Widget>
        <Widget
          indicator={
            valueDiff > 0
              ? INDICATOR.POSITIVE
              : valueDiff === 0
              ? INDICATOR.NEUTRAL
              : INDICATOR.NEGATIVE
          }
        >
          <TextDisplay>
            <BoldText>Profit/loss:</BoldText>
            <PriceDisplay value={valueDiff.toFixed()} />
          </TextDisplay>
        </Widget>
        <Widget>
          <TextDisplay>
            <BoldText>Portfolio</BoldText>
            <div>${totalAssets.toFixed()}</div>
          </TextDisplay>
        </Widget>
      </WidgetGrid>
      <AssetsList data={data} />
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default PortfolioPage;
