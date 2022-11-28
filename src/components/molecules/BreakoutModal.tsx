import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import ImageModal from "./ImageModal";
import Modal from "./Modal";
import { useModal } from "use-modal-hook";
import Rating from "./Rating";
import * as backendService from "../../services/backendService";
import { handleCalculateQuantity } from "../../util/handleQuantity";
import { handleLimitPrice } from "../../util/handleLimitPrice";
import { handleBuyOrder } from "../../lib/brokerHandler";

const InfoContainer = styled.div`
  height: 100%;
  width: 50%;
  font-size: 12px;
  padding-right: 16px;
`;

const GraphAndRatingContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 15px 0 15px 0;
  width: 70%;
  flex-direction: column;
`;

const Graph = styled.div`
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  cursor: pointer;
  :hover {
    border: 1px solid ${({ theme }) => theme.palette.actionHover.border};
  }
`;

const RatingContainer = styled.div`
  margin-top: 16px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  text-align: center;
`;

const Info = styled.div`
  height: calc(100% - 88px); // 88 = StyledButton height + padding
`;

interface Props {
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
  rating: number;
  breakoutValue: number;
  symbol: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function BreakoutModal({
  isOpen,
  onClose,
  image,
  breakoutRef,
  rating,
  breakoutValue,
  symbol,
}: Props) {
  const [enableOnClickOutside, setEnableOnClickOutside] = useState(true);

  const MyModal = memo(
    ({ isOpen: imageModalIsOpen, onClose: imageModalOnClose }: ModalProps) => (
      <ImageModal
        isOpen={imageModalIsOpen}
        onClose={() => {
          setEnableOnClickOutside(true);
          imageModalOnClose();
        }}
        image={image}
        enableOnClickOutside
      />
    ),
  );
  const [showModal] = useModal(MyModal, {});

  const handleSetRating = (value: number) => {
    const userRef = "ludde@hejare.se"; // TODO
    void backendService.setRating({ breakoutRef, userRef, value });
  };

  const [shares, setShares] = useState<number>(0);
  const [entryPrice, setEntryPrice] = useState<number>(0);

  useEffect(() => {
    const setValues = async () => {
      const brokerLimitPrice = handleLimitPrice(breakoutValue);
      console.log({ brokerLimitPrice, breakoutValue });
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
        </Info>
        <StyledButton
          onClick={() => handleBuyOrder(symbol, entryPrice, shares)}
        >
          <div>PLACE ORDER</div>
          <div>${size}</div>
        </StyledButton>
      </InfoContainer>

      <GraphAndRatingContainer>
        <Graph>
          <StyledImage
            onClick={() => {
              setEnableOnClickOutside(false);
              showModal({});
            }}
            src={image}
          />
        </Graph>
        <RatingContainer>
          <Rating currentRating={rating} handleSetRating={handleSetRating} />
        </RatingContainer>
      </GraphAndRatingContainer>
    </Modal>
  );
}
