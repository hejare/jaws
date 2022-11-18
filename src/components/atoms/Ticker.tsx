import fetch from "node-fetch";
import { useEffect, useState } from "react";
import { TickerDataType } from "../../db/tickersMeta";
import { handleResult } from "../../util";

interface Props {
  id: string;
}
const Ticker = ({ id }: Props) => {
  const [ticker, setTicker] = useState<TickerDataType>();

  useEffect(() => {
    fetch(`/api/data/tickers/${id}`)
      .then(handleResult)
      .then(setTicker)
      .catch(console.error);
  }, [id]);

  if (!ticker) {
    return <>...</>; // TODO: spinner?
  }

  return <>{ticker.symbol}</>;
};

export default Ticker;
