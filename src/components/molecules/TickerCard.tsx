import Link from "next/link";
import { handleBuyOrder, handleSellOrder } from "../../services/brokerService";

interface Props {
  ticker: string;
  price: number;
  name: string;
}

const TickerCard = ({ price, name, ticker }: Props) => {
  return (
    <div>
      <h2>
        {name} {price}
      </h2>
      <a href={`https://www.tradingview.com/symbols/${ticker}`} target="_blank">
        {ticker}
      </a>
      <button onClick={() => handleBuyOrder(ticker)}>BUY $1 {name}</button>
      <button onClick={() => handleSellOrder(ticker)}>SELL $1 {name}</button>
    </div>
  );
};

export default TickerCard;
