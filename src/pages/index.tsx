import { useState } from "react";
import styled from "styled-components";
import PageContainer from "../components/atoms/PageContainer";
import Widget from "../components/atoms/Widget";
import LatestOrders from "../components/molecules/LatestOrders";
import SummedPositions from "../components/molecules/SummedPositions";
import TriggerDailyRunButton from "../components/molecules/TriggerDailyRunButton";
import WalletBalance from "../components/molecules/WalletBalance";
import WidgetGrid from "../components/organisms/WidgetGrid";
import { getServerSidePropsAllPages } from "../lib/getServerSidePropsAllPages";

const ContentContainer = styled.div`
  display: flex;
`;

function StartPage() {
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
}

export const getServerSideProps = getServerSidePropsAllPages;
export default StartPage;
