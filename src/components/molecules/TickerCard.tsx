import Link from "next/link";
import { handleBuyOrder, handleSellOrder } from "../../services/brokerService";
import Button from '@mui/material/Button';

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
      <Button variant="contained" size="small" color="info" onClick={() => handleBuyOrder(ticker)}>BUY $1 {name}</Button>
      <Button variant="contained" size="small" color="success" onClick={() => handleSellOrder(ticker)}>SELL $1 {name}</Button>
    </div>
  );
};

export default TickerCard;
