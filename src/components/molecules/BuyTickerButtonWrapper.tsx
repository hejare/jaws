import PlaceOrderButton from "./PlaceOrderButton";

type Props = {
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  dailyRunRef: string;
  timestamp: string;
  _ref: string;
  shares: number;
  entryPrice: number;
  onPriceChange: (newPrice: number) => void;
};

const BuyTickerButtonWrapper = ({
  _ref,
  tickerRef,
  shares,
  entryPrice,
  onPriceChange,
}: Props) => {
  return (
    <PlaceOrderButton
      ticker={tickerRef}
      buyPrice={entryPrice}
      quantity={shares}
      breakoutRef={_ref}
      onPriceChange={onPriceChange}
    />
  );
};

export default BuyTickerButtonWrapper;
