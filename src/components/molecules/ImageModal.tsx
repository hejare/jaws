import styled from "styled-components";
import Modal from "./Modal";
import Rating from "./Rating";

const ImageContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const RatingContainer = styled.div`
  position: absolute;
  bottom: 4px;
  right: 20px;
  margin-top: 16px;
  height: 60px;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
  breakoutRef: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  image,
  enableOnClickOutside,
  breakoutRef,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      enableOnClickOutside={enableOnClickOutside}
    >
      <ImageContainer>
        <StyledImg src={image} />
      </ImageContainer>
      {breakoutRef && (
        <RatingContainer>
          <Rating breakoutRef={breakoutRef} />
        </RatingContainer>
      )}
    </Modal>
  );
}
