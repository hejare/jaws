import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import { handleCancelOrder } from "@jaws/lib/brokerHandler";
import { useEffect, useState } from "react";
import * as backendService from "@jaws/services/backendService";
import { useInterval } from "usehooks-ts";
import { ONE_MINUTE_IN_MS } from "@jaws/lib/helpers";
import { useTradesStore } from "@jaws/store/tradesStore";
import { TRADE_STATUS } from "@jaws/db/tradesMeta";

const StyledButton = styled(Button)`
  text-align: center;
`;

interface Props {
  ticker: string;
  disabled?: boolean;
  onClick?: () => void;
}

const CancelOrderButton = ({
  ticker,
  disabled: forceDisabled,
  onClick,
}: Props) => {
  const [interval, setInterval] = useState(0);
  const [disabled, setDisabled] = useState(forceDisabled);

  const [trade, upsertTrade, updateTrade, deleteTrade] = useTradesStore(
    (state) => [
      state.trades.find((t) => t.ticker === ticker),
      state.upsertTrade,
      state.updateTrade,
      state.deleteTrade,
    ],
  );

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService.getTradesDataByTicker(ticker).then((data) => {
      // Todo: Optimize by only setTrade if different?
      if (data) {
        upsertTrade(ticker, data);
      } else {
        deleteTrade(ticker);
      }
    });
  }, interval);

  useEffect(() => {
    if (forceDisabled) {
      setDisabled(true);
    } else {
      // TODO: Extend logics depending on STATUS which might be like "CANCELLED", "REJECTED" or such
      if (trade?.status === TRADE_STATUS.READY) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  }, [trade]);

  const show =
    trade &&
    [TRADE_STATUS.READY, TRADE_STATUS.CANCELLED].includes(trade.status);

  if (!show) {
    return <></>;
  }
  return (
    <StyledButton
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        updateTrade(ticker, {
          status: TRADE_STATUS.CANCELLED,
        });
        typeof onClick === "function" && onClick();
        await handleCancelOrder(trade.breakoutRef);
        setInterval(0);
      }}
    >
      <div>
        {trade.status === TRADE_STATUS.CANCELLED ? "CANCELLED" : "CANCEL"}
      </div>
    </StyledButton>
  );
};

export default CancelOrderButton;
