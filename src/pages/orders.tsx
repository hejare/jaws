import PageContainer from "@jaws/components/atoms/PageContainer";
import OrdersList from "@jaws/components/organisms/OrdersList";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { useGetOrdersTableData } from "@jaws/lib/hooks/useGetOrdersTableData";
import type { NextPage } from "next";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
`;

const OrdersPage: NextPage = () => {
  const { status, orders, setFilter, filter, symbols } =
    useGetOrdersTableData();

  return (
    <PageContainer>
      <Header>
        <h2>Order list</h2>
        <select
          onChange={(e) => setFilter({ symbol: e.target.value })}
          value={filter.symbol}
        >
          <option value="">All tickers</option>
          {symbols.map((a) => (
            <option value={a} key={a}>
              {a}
            </option>
          ))}
        </select>
      </Header>
      {status === "ok" && <OrdersList data={orders} />}
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default OrdersPage;
