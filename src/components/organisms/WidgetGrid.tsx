import styled from "styled-components";
import Widget from "../atoms/Widget";
import LatestOrders from "../molecules/LatestOrders";
import WalletBalance from "../molecules/WalletBalance";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const WidgetGrid = () => {
  return (
    <GridContainer>
      <Widget>
        <WalletBalance />
      </Widget>
      <Widget>
        <LatestOrders />
      </Widget>
    </GridContainer>
  );
};

export default WidgetGrid;
