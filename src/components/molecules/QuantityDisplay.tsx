import styled, { css } from "styled-components";
import { INDICATOR } from "@jaws/lib/priceHandler";
import { handleLimitPrice } from "@jaws/util/handleLimitPrice";

export enum QUANTITY_DISPLAY_VARIANTS {
  BOX = "BOX",
  INLINE = "INLINE",
}

type Props = {
  value: number;
  indicator?: INDICATOR;
  variant?: QUANTITY_DISPLAY_VARIANTS;
};

const QuantityText = styled.span`
  padding-left: 4px;

  ${({
    theme,
    indicator,
    variant,
  }: {
    theme: any;
    indicator: INDICATOR;
    variant: QUANTITY_DISPLAY_VARIANTS;
  }) => {
    return css`
      color: ${theme.palette.indicator[indicator.toLowerCase()]};
      display: ${variant === QUANTITY_DISPLAY_VARIANTS.BOX ? "flex" : ""};
    `;
  }}
`;

const QuantityDisplay = ({
  value,
  indicator = INDICATOR.NEUTRAL,
  variant = QUANTITY_DISPLAY_VARIANTS.BOX,
}: Props) => {
  return (
    <QuantityText indicator={indicator} variant={variant}>
      {handleLimitPrice(value)}
    </QuantityText>
  );
};

export default QuantityDisplay;
