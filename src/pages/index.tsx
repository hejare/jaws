import type { NextPage } from "next";
import styled from "styled-components";
import PageContainer from "../components/atoms/PageContainer";
import WidgetGrid from "../components/organisms/WidgetGrid";

const ContentContainer = styled.div`
  display: flex;
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
