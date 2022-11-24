import React from "react";
import styled, { css } from "styled-components";
import Button from "./Button";

export enum CIRCULAR_BUTTON_SIZE {
  SMALL = "SMALL",
  REGULAR = "REGULAR",
}

const CircularButtonContainer = styled(Button)`
  border-radius: 50%;
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({
    size,
  }: {
    size?: CIRCULAR_BUTTON_SIZE.SMALL | CIRCULAR_BUTTON_SIZE.REGULAR;
  }) =>
    size === CIRCULAR_BUTTON_SIZE.SMALL
      ? css`
          height: 12px;
          width: 12px;
        `
      : css`
          height: 50px;
          width: 50px;
        `};
`;

type Props = {
  onClick: () => void;
  children: React.ReactNode;
  size?: CIRCULAR_BUTTON_SIZE.SMALL | CIRCULAR_BUTTON_SIZE.REGULAR;
};

const CircularButton = ({ children, ...props }: Props) => {
  return (
    <CircularButtonContainer {...props}>{children}</CircularButtonContainer>
  );
};

export default CircularButton;
