import { useState } from "react";
import styled from "styled-components";

interface Props {
  onHover: (starNumber: number) => void;
  isHovered: boolean;
  onClick: () => void;
  starNumber: number;
  isFilled: boolean;
  isInModal?: boolean;
}

const Container = styled.div`
  display: flex;
  position: relative;
  height: 25px;
  width: 25px;
  cursor: pointer;
`;

const StarMask = styled.div`
  display: flex;
  position: absolute;
  height: 25px;
  overflow: hidden;
  width: ${({ percentageFilled }: { percentageFilled: number }) =>
    `${percentageFilled}%`};
`;

const Star = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isHovered }: { isHovered: boolean }) =>
    isHovered ? "white" : "yellow"};
  position: absolute;
  top: 0px;
  left: 0px;
  mask-image: url("/static/FilledStar.svg");
  mask-size: 25px;
`;

const StarBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ isHovered }: { isHovered: boolean }) =>
    isHovered ? "yellow" : "grey"};
  position: absolute;
  top: 0px;
  left: 0px;
  mask-image: url("/static/FilledStar.svg");
  mask-size: 25px;
`;

const RatingStar = ({
  onClick,
  onHover,
  isHovered,
  starNumber,
  isFilled,
}: Props) => {
  return (
    <Container
      onClick={onClick}
      onMouseOver={() => onHover(starNumber)}
      onMouseOut={() => onHover(-1)}
    >
      <StarBackground isHovered={isHovered} />
      <StarMask percentageFilled={isFilled ? 100 : 0}>
        <Star isHovered={isHovered} />
      </StarMask>
    </Container>
  );
};

export default RatingStar;
