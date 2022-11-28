import styled from "styled-components";
import { INDICATOR } from "../../lib/priceHandler";
import { handleLimitPrice } from "../../util/handleLimitPrice";

type Props = {
  value: number;
  indicator: INDICATOR;
};

const PercentageText = styled.div`
  color: ${({ theme, indicator }: { theme: any; indicator: INDICATOR }) =>
    theme.palette.indicator[indicator.toLowerCase()]}}
`;

const PercentageDisplay = ({ value, indicator }: Props) => {
  return (
    <PercentageText indicator={indicator}>{value.toFixed(2)}%</PercentageText>
  );
};

export default PercentageDisplay;
