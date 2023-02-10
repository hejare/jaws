import { INDICATOR } from "@jaws/lib/priceHandler";
import { handleLimitPrice } from "@jaws/util/handleLimitPrice";
import styled, { css } from "styled-components";

export enum PRICE_DISPLAY_VARIANTS {
  BOX = "BOX",
  INLINE = "INLINE",
}

type Props = {
  value: number | string;
  indicator?: INDICATOR;
  variant?: PRICE_DISPLAY_VARIANTS;
  indicatorOrigin?: number;
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
  indicatorOrigin,
}: Props) => {
  let char = "";
  const value =
    typeof inputValue === "string" ? parseInt(inputValue) : inputValue;
  if (value < 0) {
    char = "-";
  }

  let indicatorValue = indicator;

  if (indicatorOrigin !== undefined) {
    indicatorValue =
      value > indicatorOrigin
        ? INDICATOR.POSITIVE
        : value < indicatorOrigin
        ? INDICATOR.NEGATIVE
        : INDICATOR.NEUTRAL;
  }

  return (
    <PriceText indicator={indicatorValue} variant={variant}>
      {char}${Math.abs(handleLimitPrice(value))}
    </PriceText>
  );
};

export default PriceDisplay;
