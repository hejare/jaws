import React from "react";
import styled from "styled-components";
import { getDateTime } from "../../lib/helpers";
import { INDICATOR } from "../../lib/priceHandler";
import { MinimalOrderType } from "../../pages/daily-runs/[date]/[time]/prepare-order/[ticker]";
import {
  AlpacaOrderType,
  SUMMED_ORDER_STATUS,
} from "../../services/alpacaMeta";

const OrderDetails = styled.div`
  padding: 0 4px;
  border-radius: 5px;
  background-color: ${({ theme, indicator }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    indicator === INDICATOR.NEUTRAL ? theme.palette.text.secondary : "inherit"}}

`;

type Props = {
  orderDetails: MinimalOrderType | AlpacaOrderType | undefined;
  orderStatus: SUMMED_ORDER_STATUS | undefined;
};

const OrderDetailsWrapper = ({ orderDetails, orderStatus }: Props) => {
  return (
    <div>
      {orderDetails && orderStatus === SUMMED_ORDER_STATUS.IN_PROGRESS && (
        <OrderDetails indicator={INDICATOR.NEUTRAL}>
          <p>An order for this ticker is in progress:</p>
          {orderDetails.created_at && (
            <p>Placed at: {getDateTime(orderDetails.created_at)}</p>
          )}
          <p>Shares (Qty): {orderDetails.qty}</p>
          <p>Entry Price: {orderDetails.limit_price}</p>
          <p>
            Size: $
            {(
              parseInt(orderDetails.qty) * parseFloat(orderDetails.limit_price)
            ).toFixed(2)}
          </p>
        </OrderDetails>
      )}
      {orderDetails && orderStatus === SUMMED_ORDER_STATUS.FILLED && (
        <OrderDetails indicator={INDICATOR.POSITIVE}>
          <p>An order for this ticker has already completed:</p>
          <p>Completed at: {getDateTime(orderDetails.filled_at)}</p>
          <p>Shares (Qty): {orderDetails.qty}</p>
          <p>Entry Price: {orderDetails.limit_price}</p>
          <p>
            Size: $
            {(
              parseInt(orderDetails.qty) * parseFloat(orderDetails.limit_price)
            ).toFixed(2)}
          </p>
        </OrderDetails>
      )}
      {orderDetails &&
        orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT && (
          <OrderDetails indicator={INDICATOR.NEGATIVE}>
            <p>A previous order for this ticker did not complete:</p>
            <p>
              Canceled/Expired at:{" "}
              {getDateTime(
                orderDetails.canceled_at
                  ? orderDetails.canceled_at
                  : orderDetails.expired_at,
              )}
            </p>
            <p>Shares (Qty): {orderDetails.qty}</p>
            <p>Entry Price: {orderDetails.limit_price}</p>
            <p>
              Size: $
              {(
                parseInt(orderDetails.qty) *
                parseFloat(orderDetails.limit_price)
              ).toFixed(2)}
            </p>
          </OrderDetails>
        )}
    </div>
  );
};

export default OrderDetailsWrapper;
