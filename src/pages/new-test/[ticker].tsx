import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfoBar from "../../components/molecules/InfoBar";
import Rating from "../../components/molecules/Rating";
import { getServerSidePropsAllPages } from "../../lib/getServerSidePropsAllPages";
import {
  BreakoutStoreType,
  useBreakoutsStore,
} from "../../store/breakoutsStore";
import { handleLimitPrice } from "../../util/handleLimitPrice";
import { handleCalculateQuantity } from "../../util/handleQuantity";
import * as backendService from "../../services/backendService";
import {
  AlpacaOrderType,
  SUMMED_ORDER_STATUS,
} from "../../services/alpacaMeta";
import BuyTickerButtonWrapper from "../../components/molecules/BuyTickerButtonWrapper";
import { useInterval } from "usehooks-ts";
import { ONE_MINUTE_IN_MS } from "../../lib/helpers";
import { BreakoutData } from "../../components/organisms/TickerBreakoutList";
import { handleResult } from "../../util";
import OrderDetailsWrapper from "../../components/molecules/OrderDetailsWrapper";

export type MinimalOrderType = {
  qty: string;
  limit_price: string;
  created_at: string;
  canceled_at: string;
  expired_at: string;
  filled_at: string;
};

const TickerPage: NextPage = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const [currentBreakout] = useBreakoutsStore((state) => [
    state.breakouts.find((b) => b.tickerRef === ticker),
  ]);
  const [cashBalance, setCashBalance] = useState<number>();
  const [interval, setInterval] = useState(0);
  const [orderStatus, setOrderStatus] = useState<
    SUMMED_ORDER_STATUS | undefined
  >();
  const [orderDetails, setOrderDetails] = useState<
    AlpacaOrderType | MinimalOrderType
  >();

  // TODO fetch data for historical data = more than latest breakout for ticker

  // useEffect(() => {
  //   console.log("currentBreakout..", currentBreakout);
  //   setCurrentBreakoutRef(currentBreakout?.breakoutRef);
  //   setBreakoutValue(currentBreakout?.breakoutValue);

  //   setTest("hej!");
  //   void setSharesEntryPrice();
  // }, []);
  // //}, [currentBreakout]);

  // const setSharesEntryPrice = async () => {
  //   if (breakoutValue) {
  //     const brokerLimitPrice = handleLimitPrice(breakoutValue);
  //     setEntryPrice(brokerLimitPrice);

  //     const cashBalance = await backendService.getAccountCashBalance();
  //     const calculatedShares = handleCalculateQuantity(
  //       brokerLimitPrice,
  //       cashBalance,
  //     );
  //     setShares(calculatedShares);
  //   }
  // };

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

  return (
    <div>
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
                <div>Size: ${handleGetSize(currentBreakout.breakoutValue)}</div>
              </>
            )}
          </>
        )}
        {orderDetails && orderStatus && (
          <OrderDetailsWrapper
            orderDetails={orderDetails}
            orderStatus={orderStatus}
          />
        )}
        <div>
          {orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT &&
            shares &&
            entryPrice && (
              <div>
                <BuyTickerButtonWrapper
                  shares={shares}
                  entryPrice={entryPrice}
                  {...breakouts[0]}
                />
              </div>
            )}
        </div>

        <p>TODO: BUY button</p>
        <p>TODO: edit price input field</p>
      </InfoBar>
      {currentBreakout && <Rating breakoutRef={currentBreakout?.breakoutRef} />}
    </div>
  );
};
export const getServerSideProps = getServerSidePropsAllPages;
export default TickerPage;
