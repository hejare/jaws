import { useState } from "react";
import styled from "styled-components";
import Widget from "../atoms/Widget";
import LatestOrders from "../molecules/LatestOrders";
import SummedPositions from "../molecules/SummedPositions";
import TriggerDailyRunButton from "../molecules/TriggerDailyRunButton";
import WalletBalance from "../molecules/WalletBalance";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const WidgetGrid = () => {
  const [triggerRunEnabled, setTriggerRunEnabled] = useState<boolean>(true);

  const handleIndicateIsEnabled = (statement: boolean) => {
    setTriggerRunEnabled(statement);
  };
  return (
    <GridContainer>
      <Widget>
        <WalletBalance />
      </Widget>
      <Widget>
        <LatestOrders />
      </Widget>
      <Widget>
        <SummedPositions />
      </Widget>
      {triggerRunEnabled && (
        <Widget>
          <TriggerDailyRunButton
            handleIndicateIsEnabled={handleIndicateIsEnabled}
          />
        </Widget>
      )}
    </GridContainer>
  );
};

export default WidgetGrid;
