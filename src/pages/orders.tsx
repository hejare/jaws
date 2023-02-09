import PageContainer from "@jaws/components/atoms/PageContainer";
import OrdersList from "@jaws/components/organisms/OrdersList";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { useGetOrdersTableData } from "@jaws/lib/hooks/useGetOrdersTableData";
import type { NextPage } from "next";

const OrdersPage: NextPage = () => {
  const { status, orders } = useGetOrdersTableData();

  return (
    <PageContainer>
      {status === "ok" && <OrdersList data={orders} />}
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default OrdersPage;
