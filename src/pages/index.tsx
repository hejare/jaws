import PageContainer from "@jaws/components/atoms/PageContainer";
import Widget from "@jaws/components/atoms/Widget";
import LatestOrders from "@jaws/components/molecules/LatestOrders";
// import NavChart from "@jaws/components/molecules/NavChart";
import SummedPositions from "@jaws/components/molecules/SummedPositions";
import TriggerDailyRunButton from "@jaws/components/molecules/TriggerDailyRunButton";
import WalletBalance from "@jaws/components/molecules/WalletBalance";
import { StatsCompare } from "@jaws/components/organisms/StatsCompare";
import WidgetGrid from "@jaws/components/organisms/WidgetGrid";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import dynamic from "next/dynamic";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from "recharts";
import styled from "styled-components";

const ContentContainer = styled.div`
  display: flex;
`;

// Avoids this warning https://github.com/vercel/next.js/issues/12863
const ClientRenderedChart = dynamic(
  () => import("@jaws/components/molecules/NavChart"),
  { ssr: false },
);

function StartPage() {
  const [triggerRunEnabled, setTriggerRunEnabled] = useState<boolean>(false);

  const handleIndicateIsEnabled = (statement: boolean) => {
    void setTriggerRunEnabled(statement);
  };

  return (
    <PageContainer>
      <StatsCompare />
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
      <ClientRenderedChart />
    </PageContainer>
  );
}

export const getServerSideProps = getServerSidePropsAllPages;
export default StartPage;
