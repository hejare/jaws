import { BoldText } from "@jaws/components/atoms/BoldText";
import PageContainer from "@jaws/components/atoms/PageContainer";
import TextDisplay from "@jaws/components/atoms/TextDisplay";
import Widget from "@jaws/components/atoms/Widget";
import PriceDisplay from "@jaws/components/molecules/PriceDisplay";
import AssetsList from "@jaws/components/organisms/AssetsList";
import WidgetGrid from "@jaws/components/organisms/WidgetGrid";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { useGetTableData } from "@jaws/lib/hooks/useGetTableData";
import { INDICATOR } from "@jaws/lib/priceHandler";
import type { NextPage } from "next";

const PortfolioPage: NextPage = () => {
  const {
    fetchStatus,
    assets,
    investedValue,
    marketValue,
    totalPortfolioValue,
    cashBalance,
  } = useGetTableData();

  if (fetchStatus !== "ok") {
    return <></>;
  }

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
            <BoldText>Invest. P/L:</BoldText>
            <PriceDisplay value={valueDiff.toFixed()} />
          </TextDisplay>
        </Widget>
        <Widget>
          <TextDisplay>
            <BoldText>Equity</BoldText>
            <div>${totalPortfolioValue.toFixed()}</div>
          </TextDisplay>
        </Widget>
        <Widget>
          <TextDisplay>
            <BoldText>Cash</BoldText>
            <div>${cashBalance.toFixed()}</div>
          </TextDisplay>
        </Widget>
      </WidgetGrid>
      <AssetsList data={assets} />
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default PortfolioPage;
