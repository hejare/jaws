import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import { ButtonsContainer } from "../atoms/ButtonsContainer";
import { handleBuyOrder } from "../../lib/brokerHandler";
import { useEffect, useState } from "react";
import * as backendService from "../../services/backendService";
import { useInterval } from "usehooks-ts";
import { ONE_MINUTE_IN_MS } from "../../lib/helpers";
import { useTradesStore } from "../../store/tradesStore";
import { TRADE_STATUS, TRADE_SIDE } from "../../db/tradesMeta";
import Input from "../atoms/Input";

const StyledButton = styled(Button)`
  text-align: center;
`;

interface Props {
  ticker: string;
  entryPrice: number;
  quantity: number;
  breakoutRef: string;
  disabled?: boolean;
  onClick?: () => void;
}

const PlaceOrderButton = ({
  ticker,
  entryPrice,
  quantity,
  breakoutRef,
  disabled: forceDisabled,
  onClick,
}: Props) => {
  const [interval, setInterval] = useState(0);
  const [disabled, setDisabled] = useState(forceDisabled);
  const [buyPrice, setBuyPrice] = useState(entryPrice);

  const [trade, upsertTrade] = useTradesStore((state) => [
    state.trades.find((t) => t.ticker === ticker),
    state.upsertTrade,
  ]);

  useEffect(() => {
    setBuyPrice(entryPrice);
  }, [entryPrice]);

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService.getTradesDataByTicker(ticker).then((data) => {
      // Todo: Optimize by only setTrade if different?
      if (data) {
        upsertTrade(ticker, data);
      }
    });
  }, interval);

  useEffect(() => {
    if (forceDisabled) {
      setDisabled(true);
    } else {
      // TODO: Extend logics depending on STATUS which might be like "CANCELLED", "REJECTED" or such
      if (trade) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [trade]);

  const size = (quantity * buyPrice).toFixed(2);

  return (
    <ButtonsContainer>
      <Input
        value={buyPrice.toString()}
        type="number"
        step="0.01"
        onChange={(e) => setBuyPrice(e.target.value)}
        title="Price"
      />
      <StyledButton
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          setDisabled(true);
          upsertTrade(ticker, {
            ticker,
            breakoutRef,
            status: TRADE_STATUS.READY,
            side: TRADE_SIDE.BUY,
          });
          /* Note: rn this will not place an actual order. See /api/broker/orders */
          void handleBuyOrder(ticker, buyPrice, quantity, breakoutRef);
          typeof onClick === "function" && onClick();
        }}
      >
        <div>
          {!trade
            ? "PLACE ORDER"
            : trade.status === TRADE_STATUS.READY
            ? "ON ITS WAY TO THE MARKET"
            : trade.status}
        </div>
        <div>${size}</div>
      </StyledButton>
    </ButtonsContainer>
  );
};

export default PlaceOrderButton;
