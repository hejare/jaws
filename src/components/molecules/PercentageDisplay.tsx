import styled from "styled-components";
import { INDICATOR } from "../../lib/priceHandler";

type Props = {
  value: number;
  indicator?: INDICATOR;
};

const PercentageText = styled.div`
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
`;

const PercentageDisplay = ({ value, indicator = INDICATOR.NEUTRAL }: Props) => {
  return (
    <PercentageText indicator={indicator}>{value.toFixed(2)}%</PercentageText>
  );
};

export default PercentageDisplay;
