import type { NextPage } from "next";
import styled from "styled-components";
import PageContainer from "../components/atoms/PageContainer";
import WidgetGrid from "../components/organisms/WidgetGrid";

// TODO widget component
//  All positions value
// topp 3 mest investerade assets, eller topp 3 som gått med mest vinst?
// <button>Trigger todays run if not yet done</button>
// <div>latest done orders</div>

// Todo add back button in /daily-runs/[date]/[time] to /daily-runs/[date]

const ContentContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
`;

const StartPage: NextPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <WidgetGrid />
      </ContentContainer>
    </PageContainer>
  );
};

export default StartPage;
