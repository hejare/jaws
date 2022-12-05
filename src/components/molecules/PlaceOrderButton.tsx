import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import { handleBuyOrder } from "../../lib/brokerHandler";
import { useState } from "react";
import * as backendService from "../../services/backendService";
import { SUMMED_ORDER_STATUS } from "../../services/alpacaMeta";
import { useInterval } from "usehooks-ts";

const ONE_MINUTE_IN_MS = 60000;

const StyledButton = styled(Button)`
  text-align: center;
`;

interface Props {
  symbol: string;
  entryPrice: number;
  shares: number;
  breakoutRef: string;
  onClick?: () => void;
}

const PlaceOrderButton = ({
  symbol,
  entryPrice,
  shares,
  breakoutRef,
  onClick,
}: Props) => {
  const [interval, setInterval] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);
  const [ordersLength, setOrdersLength] = useState(0);
  const [ordersLengthWhenClicked, setOrdersLengthWhenClicked] = useState(0);

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService.getAccountOrderStatusByTicker(symbol).then((data) => {
      setOrderStatus(data.orderStatus);
      setOrdersLength(data.ordersOnThisDate.length);
      setHasClicked(false);
    });
  }, interval);

  const size = (shares * entryPrice).toFixed(2);
  const disabled =
    (hasClicked && ordersLengthWhenClicked === ordersLength) ||
    orderStatus !== SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT;
  return (
    <StyledButton
      disabled={disabled}
      onClick={() => {
        setOrdersLengthWhenClicked(ordersLength);
        setHasClicked(true);
        void handleBuyOrder(symbol, entryPrice, shares, breakoutRef);
        typeof onClick === "function" && onClick();
        setOrderStatus(null);
      }}
    >
      <div>PLACE ORDER</div>
      <div>${size}</div>
    </StyledButton>
  );
};

export default PlaceOrderButton;
