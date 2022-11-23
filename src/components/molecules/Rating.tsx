import { useState } from "react";
import styled from "styled-components";
import RatingStar from "../atoms/RatingStar";
import { setUserRating } from "../../lib/ratingHandler";

interface Props {
  breakoutRef: string;
  currentRating: number;
  handleSetRating: () => void;
}

const RatingContainer = styled.div`
  display: flex;
`;

const Rating = ({ breakoutRef, currentRating, handleSetRating }: Props) => {
  const [newRating, setNewRating] = useState();
  const [hoverNumber, setHoverNumber] = useState(-1);
  const [rating, setRating] = useState(0);

  const fiveStars = () => {
    const n = 5;

    return [...Array(n)].map((e, i) => (
      <RatingStar
        key={i}
        isFilled={hoverNumber === -1 && rating > i}
        onHover={setHoverNumber}
        starNumber={i}
        isHovered={hoverNumber >= i}
        onClick={() => {
          setRating(i + 1);
          void setUserRating(breakoutRef, i + 1);
        }}
      />
    ));
  };

  return <RatingContainer>{fiveStars()}</RatingContainer>;
};

export default Rating;
