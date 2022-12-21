import React from "react";
import PlaceOrderButton from "./PlaceOrderButton";

type Props = {
  //image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  dailyRunRef: string;
  timestamp: string;
  _ref: string;
  shares: number;
  entryPrice: number;
};

const BuyTickerButtonWrapper = ({
  _ref,
  tickerRef,
  shares,
  entryPrice,
}: Props) => {
  return (
    <PlaceOrderButton
      ticker={tickerRef}
      entryPrice={entryPrice}
      quantity={shares}
      breakoutRef={_ref}
    />
  );
};

export default BuyTickerButtonWrapper;
