import styled from "styled-components";
import Modal from "./Modal";
import Rating from "./Rating";

const GraphContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-direction: column;
`;

const Graph = styled.div`
  height: fit-content;
  object-fit: cover;
  background-size: cover;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImg = styled.img`
  height: fit-content;
`;

const RatingContainer = styled.div`
  margin-top: 16px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  enableOnClickOutside?: boolean;
  breakoutRef: string;
  currentRating?: number;
}

export default function ImageModal({
  isOpen,
  onClose,
  image,
  enableOnClickOutside,
  breakoutRef,
  currentRating,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      enableOnClickOutside={enableOnClickOutside}
    >
      <GraphContainer>
        <Graph>
          <StyledImg src={image} />
        </Graph>
        {breakoutRef && (
          <RatingContainer>
            <Rating initialValue={currentRating} breakoutRef={breakoutRef} />
          </RatingContainer>
        )}
      </GraphContainer>
    </Modal>
  );
}
