import { memo, useState } from "react";
import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import ImageModal from "./ImageModal";
import Modal from "./Modal";
import { useModal } from "use-modal-hook";
import Rating from "./Rating";
import * as backendService from "../../services/backendService";

const InfoContainer = styled.div`
  width: 50%;
  font-size: 12px;
`;

const GraphContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 15px 0 15px 0;
  width: 50%;
`;

const Graph = styled.div`
  width: 50vh;
  height: 50vh;
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

interface Props {
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
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
  const [showModal, hideModal] = useModal(MyModal, {});

  const handleSetRating = (value: number) => {
    const userRef = "ludde@hejare.se"; // TODO
    void backendService.setRating({ breakoutRef, userRef, value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      enableOnClickOutside={enableOnClickOutside}
    >
      <InfoContainer>
        <p>Daily pick</p>
        <p>Price: 123</p>
        <p>Entry Date:</p>
        <p>Symbol:</p>
        <p>Chart at Entry:</p>
        <p>Time:</p>
        <p>Shares:</p>
        <p>Entry Price:</p>
        <p>Size:</p>
        <Button onClick={() => console.log("click")}>BUY $1</Button>
      </InfoContainer>
      <Rating currentRating={3.5} handleSetRating={handleSetRating} />
      <GraphContainer>
        <Graph>
          <StyledImage
            onClick={() => {
              setEnableOnClickOutside(false);
              showModal({});
            }}
            src={image}
          />
        </Graph>
      </GraphContainer>
    </Modal>
  );
}
