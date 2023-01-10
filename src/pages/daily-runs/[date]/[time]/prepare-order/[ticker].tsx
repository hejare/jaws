import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavButton from "../../../../../components/atoms/buttons/NavButton";
import PageContainer from "../../../../../components/atoms/PageContainer";
import InfoBar from "../../../../../components/molecules/InfoBar";
import * as backendService from "../../../../../services/backendService";
import TickerBreakoutList, {
  BreakoutData,
} from "../../../../../components/organisms/TickerBreakoutList";
import { getServerSidePropsAllPages } from "../../../../../lib/getServerSidePropsAllPages";
import { handleResult } from "../../../../../util";
import JawsTradeViewGraph from "../../../../../components/molecules/JawsTradeViewGraph";
import {
  AlpacaOrderType,
  SUMMED_ORDER_STATUS,
} from "../../../../../services/alpacaMeta";
import BuyTickerButtonWrapper from "../../../../../components/molecules/BuyTickerButtonWrapper";
import { handleLimitPrice } from "../../../../../util/handleLimitPrice";
import { handleCalculateQuantity } from "../../../../../util/handleQuantity";
import { useInterval } from "usehooks-ts";
import { ONE_MINUTE_IN_MS } from "../../../../../lib/helpers";
import { INDICATOR } from "../../../../../lib/priceHandler";
import Rating from "../../../../../components/molecules/Rating";
import OrderDetailsWrapper from "../../../../../components/molecules/OrderDetailsWrapper";
import { useBreakoutsStore } from "../../../../../store/breakoutsStore";
import Button from "../../../../../components/atoms/buttons/Button";

export type MinimalOrderType = {
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

const RatingContainer = styled.div`
  height: 60px;
  width: 200px;
`;

const NextBreakOutContainer = styled.div`
  margin-top: 16px;
  height: 60px;
  position: absolute;
  bottom: 34px;
  right: 20px;
`

const ButtonsContainer = styled.div`
  width: 100px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 8px;
`;

const TickerPage: NextPage = () => {
  const router = useRouter();
  const { ticker, date, time } = router.query;
  const [currentBreakout, allBreakouts, setAllBreakouts] = useBreakoutsStore((state) => [
    state.breakouts.find((b) => b.tickerRef === ticker),
    state.breakouts,
    state.setBreakouts,
  ]);
  const [cashBalance, setCashBalance] = useState<number>();
  const [interval, setInterval] = useState(0);
  const [breakouts, setBreakouts] = useState<BreakoutData[]>([]);
  const [orderStatus, setOrderStatus] = useState<
    SUMMED_ORDER_STATUS | undefined
  >();
  const [orderDetails, setOrderDetails] = useState<
    AlpacaOrderType | MinimalOrderType
  >();

  useEffect(() => {
    fetch(`/api/data/daily-runs/${date as string}/${time as string}`)
      .then(handleResult)
      .then((result) => {
        setAllBreakouts(result.breakouts);
      });
  }, []);

  useEffect(() => {
    if (!ticker || Array.isArray(ticker)) {
      return;
    }
    fetch(`/api/data/tickers/breakouts/${ticker}`)
      .then(handleResult)
      .then((result) => {
        setBreakouts(result.breakouts);
      })
      .catch(console.error);
  }, [ticker]);

  useEffect(() => {
    const fetchData = async () => {
      const balance = await backendService.getAccountCashBalance();
      setCashBalance(balance);
    };
    void fetchData();
  }, []);

  const handleGetShares = (brokerLimitPrice: number) => {
    if (cashBalance)
      return handleCalculateQuantity(brokerLimitPrice, cashBalance);
    else return 0;
  };

  const handleGetSize = (breakoutValue: number) => {
    if (cashBalance) {
      const shares = handleCalculateQuantity(breakoutValue, cashBalance);
      return (shares * breakoutValue).toFixed(2);
    } else return 0;
  };

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService
      .getAccountOrderStatusByTicker(ticker as string)
      .then((data) => {
        setOrderStatus(data.orderStatus);
        setOrderDetails(data.orderDetails);
      });
  }, interval);

  if (!currentBreakout) return null;
  const indexCurrentBreakout = allBreakouts.findIndex((breakout) => breakout.tickerRef === ticker);
  const nextTicker = allBreakouts[indexCurrentBreakout + 1]?.tickerRef;
  const previousTicker = allBreakouts[indexCurrentBreakout - 1]?.tickerRef;

  return (
    <PageContainer>
      <NavButton href={`/daily-runs/${date}/${time}`}>
        Back to daily run
      </NavButton>
      <h1>{`${(ticker as string).toUpperCase()}`}</h1>
      <NavButton disabled={!previousTicker} href={`/daily-runs/${date}/${time}/prepare-order/${previousTicker}`}>
        Previous
      </NavButton>
      <NavButton disabled={!nextTicker} href={`/daily-runs/${date}/${time}/prepare-order/${nextTicker}`}>
        Next
      </NavButton>
      <TickerPageContainer>
        <div style={{ gridArea: "graph" }}>
          {currentBreakout && (
            <RatingContainer>
              <Rating breakoutRef={currentBreakout?.breakoutRef} />
            </RatingContainer>
          )}
          {currentBreakout ? (
            <JawsTradeViewGraph
              image={currentBreakout.image}
              breakoutRef={currentBreakout.breakoutRef}
              tickerRef={currentBreakout.tickerRef}
            />
          ) : (
            <div>no data...</div>
          )}
        </div>
        <div style={{ gridArea: "sidebar" }}>
          <InfoBar>
            <h2>{ticker}</h2>
            {currentBreakout && (
              <>
                <div>
                  Breakout value/entry price:{" "}
                  {handleLimitPrice(currentBreakout.breakoutValue)}
                </div>
                {cashBalance && (
                  <>
                    <div>
                      Shares/quantity :
                      {handleGetShares(
                        handleLimitPrice(currentBreakout.breakoutValue),
                      )}
                    </div>
                    <div>
                      Size: ${handleGetSize(currentBreakout.breakoutValue)}
                    </div>
                  </>
                )}
              </>
            )}
            <OrderDetailsWrapper
              orderDetails={orderDetails}
              orderStatus={orderStatus}
            />
            <div>
              {orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT &&
                currentBreakout && (
                  <div>
                    <BuyTickerButtonWrapper
                      shares={handleGetShares(
                        handleLimitPrice(currentBreakout.breakoutValue),
                      )}
                      entryPrice={handleLimitPrice(
                        currentBreakout.breakoutValue,
                      )}
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
            titleText={`Breakouts for ${(ticker as string).toUpperCase()}`}
          />
        </div>
      </TickerPageContainer>
    </PageContainer>
  );
};
export const getServerSideProps = getServerSidePropsAllPages;
export default TickerPage;
