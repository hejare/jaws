import NavButton from "./NavButton";

const TradeViewButton = ({
  symbol,
  children,
}: {
  symbol: string;
  children: React.ReactNode;
}) => (
  <NavButton href={`https://www.tradingview.com/symbols/${symbol}`}>
    {children}
  </NavButton>
);

export default TradeViewButton;
