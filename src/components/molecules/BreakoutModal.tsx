import { memo, useState } from "react";
import styled from "styled-components";
import Button from "../atoms/buttons/Button";
import ImageModal from "./ImageModal";
import Modal from "./Modal";
import { useModal } from "use-modal-hook";

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
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function BreakoutModal({ isOpen, onClose, image }: Props) {
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
