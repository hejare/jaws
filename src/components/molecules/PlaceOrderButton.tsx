import { TRADE_SIDE, TRADE_STATUS } from "@jaws/db/tradesMeta";
import { handleBuyOrder } from "@jaws/lib/brokerHandler";
import { ONE_MINUTE_IN_MS } from "@jaws/lib/helpers";
import * as backendService from "@jaws/services/backendService";
import { useTradesStore } from "@jaws/store/tradesStore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";
import Button from "../atoms/buttons/Button";
import { ButtonsContainer } from "../atoms/ButtonsContainer";
import Input from "../atoms/Input";

const StyledButton = styled(Button)`
  text-align: center;
`;

interface Props {
  ticker: string;
  buyPrice: number;
  quantity: number;
  breakoutRef: string;
  disabled?: boolean;
  onClick?: () => void;
  onPriceChange: (newPrice: number) => void;
}

const PlaceOrderButton = ({
  ticker,
  buyPrice,
  quantity,
  breakoutRef,
  disabled: forceDisabled,
  onClick,
  onPriceChange,
}: Props) => {
  const [interval, setInterval] = useState(0);
  const [disabled, setDisabled] = useState(forceDisabled);

  const [trade, upsertTrade] = useTradesStore((state) => [
    state.trades.find((t) => t.ticker === ticker),
    state.upsertTrade,
  ]);

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
  }, [forceDisabled, trade]);

  const size = (quantity * buyPrice).toFixed(2);

  return (
    <ButtonsContainer>
      <div>
        <Input
          value={buyPrice.toString()}
          type="number"
          step="0.01"
          onChange={(e) => onPriceChange(e.target.value)}
          title="Price"
        />{" "}
        <div>Shares/quantity : {quantity}</div>
      </div>
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
