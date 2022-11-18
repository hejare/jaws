import styled from "styled-components";
import type { NextPage } from "next";
import OrdersList from "../components/organisms/OrdersList";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Orders: NextPage = () => {
  return (
    <PageContainer>
      <OrdersList />
    </PageContainer>
  );
};

export default Orders;
