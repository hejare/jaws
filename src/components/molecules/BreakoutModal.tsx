import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import ImageModal from "./ImageModal";
import Modal from "./Modal";
import { useModal } from "use-modal-hook";
import Rating from "./Rating";
import * as backendService from "../../services/backendService";
import { handleCalculateQuantity } from "../../util/handleQuantity";
import { handleLimitPrice } from "../../util/handleLimitPrice";
import PlaceOrderButton from "./PlaceOrderButton";
import { useInterval } from "usehooks-ts";
import {
  AlpacaOrderType,
  SUMMED_ORDER_STATUS,
} from "../../services/alpacaMeta";
import { getDateTime, ONE_MINUTE_IN_MS } from "../../lib/helpers";
import { INDICATOR } from "../../lib/priceHandler";
import Button from "../atoms/buttons/Button";
import { TradeViewWidget } from "../atoms/TradeViewWidget";
import ErrorMessage from "../atoms/ErrorMessage";

const InfoContainer = styled.div`
  height: 100%;
  font-size: 12px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  place-content: space-between;
`;

const ImageContainer = styled.div`
  height: 100%;
`;

const IframeContainer = styled.div`
  width: -webkit-fill-available;
`;

const ButtonsContainer = styled.div`
  width: 100px;
`;
const StyledButton = styled(Button)`
  margin-bottom: 8px;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  :hover {
    border: 1px solid ${({ theme }) => theme.palette.actionHover.border};
  }
`;

const RatingContainer = styled.div`
  margin-top: 16px;
  height: 60px;
  position: absolute;
  bottom: 4px;
  right: 20px;
`;

const Info = styled.div``;

const OrderDetails = styled.div`
  padding: 0 4px;
  border-radius: 5px;
  background-color: ${({ theme, indicator }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    indicator === INDICATOR.NEUTRAL ? theme.palette.text.secondary : "inherit"}}

`;
interface Props {
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
  breakoutValue: number;
  symbol: string;
}

type MinimalOrderType = {
  qty: string;
  limit_price: string;
  created_at: string;
  canceled_at: string;
  expired_at: string;
  filled_at: string;
};
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function BreakoutModal({
  isOpen,
  onClose,
  image,
  breakoutRef,
  breakoutValue,
  symbol,
}: Props) {
  const [interval, setInterval] = useState(0);
  const [orderStatus, setOrderStatus] = useState<
    SUMMED_ORDER_STATUS | undefined
  >();
  const [orderDetails, setOrderDetails] = useState<
    AlpacaOrderType | MinimalOrderType
  >();
  const [enableOnClickOutside, setEnableOnClickOutside] = useState(true);

  const TheImageModal = memo(
    ({ isOpen: imageModalIsOpen, onClose: imageModalOnClose }: ModalProps) => (
      <ImageModal
        isOpen={imageModalIsOpen}
        onClose={() => {
          setEnableOnClickOutside(true);
          imageModalOnClose();
        }}
        image={image}
        enableOnClickOutside
        breakoutRef={breakoutRef}
      />
    ),
  );
  const [showModal] = useModal(TheImageModal, {});
  const [showingImage, setShowingImage] = useState(true);
  const [shares, setShares] = useState<number>(0);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const setValues = async () => {
      const brokerLimitPrice = handleLimitPrice(breakoutValue);
      setEntryPrice(brokerLimitPrice);

      const cashBalance = await backendService.getAccountCashBalance();
      const calculatedShares = handleCalculateQuantity(
        brokerLimitPrice,
        cashBalance,
      );
      setShares(calculatedShares);
    };
    void setValues();
  }, []);

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    void backendService.getAccountOrderStatusByTicker(symbol).then((data) => {
      setOrderStatus(data.orderStatus);
      setOrderDetails(data.orderDetails);
    });
  }, interval);

  const size = (shares * entryPrice).toFixed(2);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      enableOnClickOutside={enableOnClickOutside}
    >
      <InfoContainer>
        <Info>
          <p>
            Symbol: <b>{symbol}</b>
          </p>
          <p>Entry Price: {entryPrice}</p>
          <p>Shares (Qty): {shares}</p>
          <p>Size: ${size}</p>
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
                  parseInt(orderDetails.qty) *
                  parseFloat(orderDetails.limit_price)
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
                  parseInt(orderDetails.qty) *
                  parseFloat(orderDetails.limit_price)
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
        </Info>
        <ButtonsContainer>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          {!errorMessage && (
            <StyledButton onClick={() => setShowingImage(!showingImage)}>
              {showingImage ? "Show Tradeview" : "Show Graph"}
            </StyledButton>
          )}
          {orderStatus === SUMMED_ORDER_STATUS.OPEN_FOR_PLACEMENT && (
            <PlaceOrderButton
              onClick={() => {
                setOrderStatus(SUMMED_ORDER_STATUS.IN_PROGRESS);
                setOrderDetails({
                  qty: shares.toString(),
                  limit_price: entryPrice.toString(),
                  created_at: Date.now().toString(),
                  canceled_at: Date.now().toString(),
                  expired_at: Date.now().toString(),
                  filled_at: Date.now().toString(),
                });
              }}
              symbol={symbol}
              entryPrice={entryPrice}
              shares={shares}
              breakoutRef={breakoutRef}
            />
          )}
        </ButtonsContainer>
      </InfoContainer>

      {showingImage ? (
        <ImageContainer>
          <StyledImage
            onClick={() => {
              setEnableOnClickOutside(false);
              showModal({});
            }}
            src={image}
            onError={() => {
              setErrorMessage(
                "Graph not accessible - will not be able to view Sharkster generated image",
              );
              setShowingImage(false);
            }}
          />
        </ImageContainer>
      ) : (
        <IframeContainer>
          <TradeViewWidget ticker={symbol} />
        </IframeContainer>
      )}
      <RatingContainer>
        <Rating breakoutRef={breakoutRef} />
      </RatingContainer>
    </Modal>
  );
}
