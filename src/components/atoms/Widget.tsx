import React from "react";
import styled, { css } from "styled-components";
import { INDICATOR } from "@jaws/lib/priceHandler";

const StyledWidget = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 155px;
  width: 155px;
  border-radius: 20px;
  background-color: grey;
  flex-direction: column;

  ${({
    theme,
    indicator = INDICATOR.NEUTRAL,
  }: {
    theme: any;
    indicator?: INDICATOR;
  }) => {
    return css`
      color: ${indicator === INDICATOR.NEUTRAL
        ? theme.palette.text.secondary
        : "inherit"};
      background-color: ${theme.palette.indicator[indicator.toLowerCase()]};
    `;
  }}
`;

type Props = {
  indicator?: INDICATOR;
  children?: React.ReactNode;
};

const Widget = ({ indicator, children }: Props) => {
  return <StyledWidget indicator={indicator}>{children}</StyledWidget>;
};

export default Widget;
