import { useState } from "react";
import styled from "styled-components";
import CircularButton, {
  CIRCULAR_BUTTON_SIZE,
} from "../atoms/buttons/CircularButton";
import RatingStar from "../atoms/RatingStar";
import * as backendService from "../../services/backendService";

interface Props {
  breakoutRef: string;
  initialValue?: number;
}

const RatingContainer = styled.div`
  display: flex;
`;

const StyledCircularButton = styled(CircularButton)`
  margin-right: 4px;
  font-size: 0.6em;
  padding: 12px;
  white-space: nowrap;
  ${({ ratedZero }: { ratedZero?: boolean }) =>
    ratedZero ? "background-color: red;" : ""}
`;

const RatingsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 0.3px solid grey;
  padding: 10px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.palette.background.backdrop};
`;

const Rating = ({ initialValue = 0, breakoutRef }: Props) => {
  const [hoverNumber, setHoverNumber] = useState(-1);
  const [rating, setRating] = useState(initialValue);

  const setValue = (value: number) => {
    setRating(value);
    const userRef = "ludde@hejare.se"; // TODO
    void backendService.setRating({ breakoutRef, userRef, value });
  };

  const fiveStars = () => {
    const n = 5;

    return [...Array(n)].map((e, i) => (
      <RatingStar
        key={i}
        isFilled={hoverNumber === -1 && !!rating && rating > i}
        onHover={setHoverNumber}
        starNumber={i}
        isHovered={hoverNumber >= i}
        onClick={() => {
          setValue(i + 1);
        }}
      />
    ));
  };

  return (
    <RatingsWrapper>
      {rating === -1 ? (
        <StyledCircularButton
          ratedZero
          size={CIRCULAR_BUTTON_SIZE.SMALL}
          onClick={() => setValue(0)}
        >
          :(
        </StyledCircularButton>
      ) : (
        <StyledCircularButton
          size={CIRCULAR_BUTTON_SIZE.SMALL}
          onClick={() => setValue(-1)}
        >
          X
        </StyledCircularButton>
      )}
      <RatingContainer>{fiveStars()}</RatingContainer>
    </RatingsWrapper>
  );
};

export default Rating;
