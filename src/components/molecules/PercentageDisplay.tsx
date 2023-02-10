import { INDICATOR } from "@jaws/lib/priceHandler";
import styled from "styled-components";

type Props = {
  value: number;
  indicator?: INDICATOR;
  indicatorOrigin?: number;
};

const PercentageText = styled.div`
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
`;

const PercentageDisplay = ({
  value,
  indicator = INDICATOR.NEUTRAL,

  indicatorOrigin,
}: Props) => {
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
    <PercentageText indicator={indicatorValue}>
      {value.toFixed(2)}%
    </PercentageText>
  );
};

export default PercentageDisplay;
