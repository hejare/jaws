import Button from "@jaws/components/atoms/buttons/Button";
import NavButton from "@jaws/components/atoms/buttons/NavButton";
import PageContainer from "@jaws/components/atoms/PageContainer";
import TextDisplay from "@jaws/components/atoms/TextDisplay";
import InfoBar from "@jaws/components/molecules/InfoBar";
import TickerBreakoutList from "@jaws/components/organisms/TickerBreakoutList";
import { handleSellOrderByTickerId } from "@jaws/lib/brokerHandler";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { INDICATOR } from "@jaws/lib/priceHandler";
import { handleResult } from "@jaws/util";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const StyledText = styled.div`
  ${({
    theme,
    indicator = INDICATOR.NEUTRAL,
  }: {
    theme: any;
    indicator?: INDICATOR;
  }) => {
    return css`
      color: ${theme.palette.indicator[indicator.toLowerCase()]};
    `;
  }}
`;

interface Asset {
  avg_entry_price?: string;
  change_today?: string;
  market_value?: string;
  qty?: string;
}

export type PartialOrderDataType = {
  created_at?: string;
  filled_at?: string;
  notional?: string;
  symbol?: string;
  qty?: number;
};

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const TickerPageContainer = styled.div`
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  grid-template-areas:
    "table table table sidebar"
    ". . . sidebar";
`;

const TickerPage: NextPage = () => {
  const [asset, setAsset] = useState<Asset>();
  const [orders, setOrders] = useState([]);
  const [breakouts, setBreakouts] = useState([]);
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [assetDiff, setAssetDiff] = useState<number>();
  const [percentageDiff, setPercentageDiff] = useState<number>();

  const router = useRouter();
  const { ticker } = router.query;

  useEffect(() => {
    if (!ticker || Array.isArray(ticker)) {
      return;
    }

    fetch(`/api/broker/tickers/${ticker}`)
      .then(handleResult)
      .then((result) => {
        setAsset(result.asset);
        setOrders(result.orders);
      })
      .catch(console.error);
    fetch(`/api/data/tickers/breakouts/${ticker}`)
      .then(handleResult)
      .then((result) => {
        setBreakouts(result.breakouts);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [ticker]);

  useEffect(() => {
    if (asset) {
      const entryPrice = asset.avg_entry_price;
      const currentValue = asset.market_value;
      const quantity = asset.qty;
      if (entryPrice && currentValue && quantity) {
        setAssetDiff(
          parseFloat(currentValue) -
            parseFloat(entryPrice) * parseFloat(quantity),
        );
        setPercentageDiff(
          ((parseFloat(currentValue) - parseFloat(entryPrice)) /
            parseFloat(entryPrice)) *
            100,
        );
      }
    }
  }, [asset]);

  if (dataFetchStatus !== STATUS.READY || !ticker || Array.isArray(ticker)) {
    return <></>;
  }

  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>

      <h1>{`${ticker.toUpperCase()}`}</h1>
      <TickerPageContainer>
        <div style={{ gridArea: "table" }}>
          <TickerBreakoutList data={breakouts} />
        </div>

        <div style={{ gridArea: "sidebar" }}>
          <InfoBar>
            <TextDisplay>
              <h2>Orders</h2>
              {orders ? (
                orders.map((order: PartialOrderDataType, i) => (
                  <div key={i}>
                    <div>Created at: {order.created_at}</div>
                    <div>Filled at: {order.filled_at}</div>
                    <div>
                      Quantity: {order.notional ? order.notional : order.qty}
                    </div>
                  </div>
                ))
              ) : (
                <div>No orders for this ticker</div>
              )}
              <h2>Asset</h2>
              {asset ? (
                <>
                  <div>
                    <div>Entry price: {asset.avg_entry_price}</div>
                    <div>Current price: {asset.market_value}</div>

                    {assetDiff && assetDiff > 0 && (
                      <StyledText indicator={INDICATOR.POSITIVE}>
                        Value increase: ${Math.abs(assetDiff).toFixed(2)}
                      </StyledText>
                    )}
                    {assetDiff && assetDiff < 0 && (
                      <StyledText indicator={INDICATOR.NEGATIVE}>
                        Value loss: -${Math.abs(assetDiff).toFixed(2)}
                      </StyledText>
                    )}
                  </div>

                  {percentageDiff && percentageDiff > 0 ? (
                    <StyledText indicator={INDICATOR.POSITIVE}>
                      Change {percentageDiff?.toFixed(2)}%
                    </StyledText>
                  ) : (
                    <StyledText indicator={INDICATOR.NEGATIVE}>
                      Change {percentageDiff?.toFixed(2)}%
                    </StyledText>
                  )}

                  <Button
                    onClick={() => handleSellOrderByTickerId(ticker, 100)}
                  >
                    Sell 100%
                  </Button>
                </>
              ) : (
                <div>No asset for this ticker</div>
              )}
            </TextDisplay>
          </InfoBar>
        </div>
      </TickerPageContainer>
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default TickerPage;
