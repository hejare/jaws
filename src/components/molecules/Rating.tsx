import { useState } from "react";
import styled from "styled-components";
import RatingStar from "../atoms/RatingStar";

interface Props {
  currentRating: number;
  handleSetRating?: (value: number) => void;
}

const RatingContainer = styled.div`
  display: flex;
`;

const Rating = ({ currentRating, handleSetRating }: Props) => {
  const [hoverNumber, setHoverNumber] = useState(-1);
  const [rating, setRating] = useState(currentRating);

  const disabled = !handleSetRating;

  const fiveStars = () => {
    const n = 5;

    return [...Array(n)].map((e, i) => (
      <RatingStar
        key={i}
        isFilled={hoverNumber === -1 && rating > i}
        onHover={(value) => !disabled && setHoverNumber(value)}
        starNumber={i}
        isHovered={!disabled && hoverNumber >= i}
        onClick={() => {
          if (!disabled) {
            setRating(i + 1);
            handleSetRating(i + 1);
          }
        }}
      />
    ));
  };

  return <RatingContainer>{fiveStars()}</RatingContainer>;
};

export default Rating;
