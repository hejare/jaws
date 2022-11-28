import styled, { css } from "styled-components";
import { INDICATOR } from "../../lib/priceHandler";
import { handleLimitPrice } from "../../util/handleLimitPrice";

export enum PRICE_DISPLAY_VARIANTS {
  BOX = "BOX",
  INLINE = "INLINE",
}

type Props = {
  value: number;
  indicator?: INDICATOR;
  variant?: PRICE_DISPLAY_VARIANTS;
};

const PriceText = styled.span`
  padding-left: 4px;
  ${({
    theme,
    indicator,
    variant,
  }: {
    theme: any;
    indicator: INDICATOR;
    variant: PRICE_DISPLAY_VARIANTS;
  }) => {
    return css`
      color: ${theme.palette.indicator[indicator.toLowerCase()]};
      display: ${variant === PRICE_DISPLAY_VARIANTS.BOX ? "flex" : ""};
    `;
  }}
`;

const PriceDisplay = ({
  value,
  indicator = INDICATOR.NEUTRAL,
  variant = PRICE_DISPLAY_VARIANTS.BOX,
}: Props) => {
  let char = "";
  if (value < 0) {
    char = "-";
  }
  return (
    <PriceText indicator={indicator} variant={variant}>
      {char}${Math.abs(handleLimitPrice(value))}
    </PriceText>
  );
};

export default PriceDisplay;
