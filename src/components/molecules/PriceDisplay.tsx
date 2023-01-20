import styled, { css } from "styled-components";
import { INDICATOR } from "@jaws/lib/priceHandler";
import { handleLimitPrice } from "@jaws/util/handleLimitPrice";

export enum PRICE_DISPLAY_VARIANTS {
  BOX = "BOX",
  INLINE = "INLINE",
}

type Props = {
  value: number | string;
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
  value: inputValue,
  indicator = INDICATOR.NEUTRAL,
  variant = PRICE_DISPLAY_VARIANTS.BOX,
}: Props) => {
  let char = "";
  const value =
    typeof inputValue === "string" ? parseInt(inputValue) : inputValue;
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
