import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../util";
import AssetsList from "../components/organisms/AssetsList";
import PageContainer from "../components/atoms/PageContainer";
import Widget from "../components/atoms/Widget";
import TextDisplay from "../components/atoms/TextDisplay";
import WidgetGrid from "../components/organisms/WidgetGrid";
import { INDICATOR } from "../lib/priceHandler";
import { BoldText } from "../components/atoms/BoldText";
import PriceDisplay from "../components/molecules/PriceDisplay";
import { getServerSidePropsAllPages } from "../lib/getServerSidePropsAllPages";

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
    fetch("/api/broker/account/assets")
      .then(handleResult)
      .then((result) => {
        const assets = result.assets;
        const investedValue = assets.reduce(
          (sum: number, { cost_basis }: { cost_basis: string }) =>
            sum + parseFloat(cost_basis),
          0,
        );
        const marketValue = assets.reduce(
          (sum: number, { market_value }: { market_value: string }) =>
            sum + parseFloat(market_value),
          0,
        );
        setValues([investedValue, marketValue]);
        setData(assets);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  if (dataFetchStatus !== STATUS.READY) {
    return <></>;
  }

  const [investedValue, marketValue] = values;
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
            <BoldText>Portfolio</BoldText>
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
            <BoldText>{valueDiff > 0 ? "Earn:" : "Loss:"}</BoldText>
            <PriceDisplay value={valueDiff.toFixed()} />
          </TextDisplay>
        </Widget>
      </WidgetGrid>
      <AssetsList data={data} />
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default PortfolioPage;
