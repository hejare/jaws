import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavButton from "../../components/atoms/buttons/NavButton";
import PageContainer from "../../components/atoms/PageContainer";
import TextDisplay from "../../components/atoms/TextDisplay";
import InfoBar from "../../components/molecules/InfoBar";
import * as backendService from "../../services/backendService";
import TickerBreakoutList, {
  BreakoutData,
} from "../../components/organisms/TickerBreakoutList";
import { getServerSidePropsAllPages } from "../../lib/getServerSidePropsAllPages";
import { handleResult } from "../../util";
import JawsTradeViewGraph from "../../components/molecules/JawsTradeViewGraph";
import {
  AlpacaOrderType,
  SUMMED_ORDER_STATUS,
} from "../../services/alpacaMeta";
import BuyTickerButtonWrapper from "../../components/molecules/BuyTickerButtonWrapper";
import { handleLimitPrice } from "../../util/handleLimitPrice";
import { handleCalculateQuantity } from "../../util/handleQuantity";
import { useInterval } from "usehooks-ts";
import { getDateTime, ONE_MINUTE_IN_MS } from "../../lib/helpers";
import { INDICATOR } from "../../lib/priceHandler";

// TODO: testa SUMMED_ORDER_STATUS - de olika alternativen för att se att det blir rätt
// TODO kolla rating!!

type MinimalOrderType = {
  qty: string;
  limit_price: string;
  created_at: string;
  canceled_at: string;
  expired_at: string;
  filled_at: string;
};

const TickerPageContainer = styled.div`
  margin: 20px;
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  grid-template-areas:
    "graph graph graph sidebar"
    "table table table table";
  gap: 10px;
`;

const OrderDetails = styled.div`
  padding: 0 4px;
  border-radius: 5px;
  background-color: ${({ theme, indicator }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    indicator === INDICATOR.NEUTRAL ? theme.palette.text.secondary : "inherit"}}

`;

const TickerPage: NextPage = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const [breakouts, setBreakouts] = useState<BreakoutData[]>([]);
  const [orderStatus, setOrderStatus] = useState<
    SUMMED_ORDER_STATUS | undefined
  >();
  const [shares, setShares] = useState<number>(0);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [latestBreakoutValue, setLatestBreakoutValue] = useState<number>();
  const [interval, setInterval] = useState(0);

  const [orderDetails, setOrderDetails] = useState<
    AlpacaOrderType | MinimalOrderType
  >();

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService
      .getAccountOrderStatusByTicker(ticker as string)
      .then((data) => {
        console.log("data 🎈", data);
        setOrderStatus(data.orderStatus);
        setOrderDetails(data.orderDetails);
      });
  }, interval);

  useEffect(() => {
    // TODO use store do not fetch from here
    if (!ticker || Array.isArray(ticker)) {
      return;
    }
    fetch(`/api/data/tickers/breakouts/${ticker}`)
      .then(handleResult)
      .then((result) => {
        setBreakouts(result.breakouts);
        setLatestBreakoutValue(result.breakouts[0].breakoutValue);
      })
      .catch(console.error);
    void setValues();
  }, [ticker]);

  const setValues = async () => {
    if (latestBreakoutValue) {
      const brokerLimitPrice = handleLimitPrice(latestBreakoutValue);
      setEntryPrice(brokerLimitPrice);

      const cashBalance = await backendService.getAccountCashBalance();
      const calculatedShares = handleCalculateQuantity(
        brokerLimitPrice,
        cashBalance,
      );
      setShares(calculatedShares);
    }
  };

  const size = (shares * entryPrice).toFixed(2);
  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>
      <h1>{`${ticker.toUpperCase()}`}</h1>
      <TickerPageContainer>
        <div style={{ gridArea: "graph" }}>
          {breakouts[0] ? (
            <JawsTradeViewGraph {...breakouts[0]} />
          ) : (
            <div>no data...</div>
          )}
        </div>
        <div style={{ gridArea: "sidebar" }}>
          <InfoBar>
            <div>
              <p>
                Symbol: <b>{ticker}</b>
              </p>
              <p>Entry Price (breakout. val): {entryPrice}</p>
              <p>Shares (Qty): {shares}</p>
              <p>Size: ${size}</p>
              {orderDetails &&
                orderStatus === SUMMED_ORDER_STATUS.IN_PROGRESS && (
                  <OrderDetails indicator={INDICATOR.NEUTRAL}>
                    <p>An order for this ticker is in progress:</p>
                    {orderDetails.created_at && (
                      <p>Placed at: {getDateTime(orderDetails.created_at)}</p>
                    )}
                    <p>Shares (Qty): {orderDetails.qty}</p>
                    <p>Entry Price: {orderDetails.limit_price}</p>
                    <p>
                      Size: $
                      {(
                        parseInt(orderDetails.qty) *
                        parseFloat(orderDetails.limit_price)
                      ).toFixed(2)}
                    </p>
                  </OrderDetails>
                )}
              {orderDetails && orderStatus === SUMMED_ORDER_STATUS.FILLED && (
                <OrderDetails indicator={INDICATOR.POSITIVE}>
                  <p>An order for this ticker has already completed:</p>
                  <p>Completed at: {getDateTime(orderDetails.filled_at)}</p>
                  <p>Shares (Qty): {orderDetails.qty}</p>
                  <p>Entry Price: {orderDetails.limit_price}</p>
                  <p>
                    Size: $
                    {(
                      parseInt(orderDetails.qty) *
                      parseFloat(orderDetails.limit_price)
                    ).toFixed(2)}
                  </p>
                </OrderDetails>
              )}
              {orderDetails &&
                orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT && (
                  <OrderDetails indicator={INDICATOR.NEGATIVE}>
                    <p>A previous order for this ticker did not complete:</p>
                    <p>
                      Canceled/Expired at:{" "}
                      {getDateTime(
                        orderDetails.canceled_at
                          ? orderDetails.canceled_at
                          : orderDetails.expired_at,
                      )}
                    </p>
                    <p>Shares (Qty): {orderDetails.qty}</p>
                    <p>Entry Price: {orderDetails.limit_price}</p>
                    <p>
                      Size: $
                      {(
                        parseInt(orderDetails.qty) *
                        parseFloat(orderDetails.limit_price)
                      ).toFixed(2)}
                    </p>
                  </OrderDetails>
                )}
              <div>EDIT!</div>
            </div>
            <div>
              {orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT && (
                <div>
                  <BuyTickerButtonWrapper
                    shares={shares}
                    entryPrice={entryPrice}
                    {...breakouts[0]}
                  />
                </div>
              )}
            </div>
          </InfoBar>
        </div>
        <div style={{ gridArea: "table" }}>
          <TickerBreakoutList
            data={breakouts}
            titleText={`Breakouts for ${ticker.toUpperCase()}`}
          />
        </div>
      </TickerPageContainer>
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default TickerPage;
