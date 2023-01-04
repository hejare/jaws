import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  leftText: string;
  rightText: string;
  leftButtonOnClick: () => void;
  rightButtonOnClick: () => void;
};

const ButtonContainer = styled.div`
  width: 200px;
  height: 35px;
  border-radius: 20px;
  border: 0.5px solid black;
  background-color: lightgrey;
  display: flex;
  margin-left: 5px;
  color: black;
`;

const ButtonItem = styled.div`
  width: 50%;
  border-radius: ${({ active }: { active: boolean }) => active && "20px"};
  background-color: ${({ active }: { active: boolean }) =>
    active ? "rgba(255, 255, 255, 0.7)" : "none"};
  border: ${({ active }: { active: boolean }) => active && "1px solid black"};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  // TODO add nice transition
`;

const ToggleButton = ({
  leftText,
  rightText,
  leftButtonOnClick,
  rightButtonOnClick,
}: Props) => {
  const [isActive, setIsActive] = useState(true);

  const handleLeft = () => {
    setIsActive(!isActive);
    leftButtonOnClick();
  };
  const handleRight = () => {
    setIsActive(!isActive);
    rightButtonOnClick();
  };
  return (
    <ButtonContainer>
      <ButtonItem active={isActive} onClick={handleLeft}>
        {leftText ? leftText : "Jaws"}
      </ButtonItem>
      <ButtonItem active={!isActive} onClick={handleRight}>
        {rightText ? rightText : "Tradeview"}
      </ButtonItem>
    </ButtonContainer>
  );
};

export default ToggleButton;
