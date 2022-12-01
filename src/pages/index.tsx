import type { NextPage } from "next";
import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/atoms/PageContainer";
import Widget from "../components/atoms/Widget";
import LatestOrders from "../components/molecules/LatestOrders";
import SummedPositions from "../components/molecules/SummedPositions";
import TriggerDailyRunButton from "../components/molecules/TriggerDailyRunButton";
import WalletBalance from "../components/molecules/WalletBalance";
import WidgetGrid from "../components/organisms/WidgetGrid";

const ContentContainer = styled.div`
  display: flex;
`;

const StartPage: NextPage = () => {
  const [triggerRunEnabled, setTriggerRunEnabled] = useState<boolean>(false);

  const handleIndicateIsEnabled = (statement: boolean) => {
    void setTriggerRunEnabled(statement);
  };

  return (
    <PageContainer>
      <ContentContainer>
        <WidgetGrid>
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
        </WidgetGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default StartPage;
