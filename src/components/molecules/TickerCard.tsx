import Link from "next/link";

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
    </div>
  );
};

export default TickerCard;
