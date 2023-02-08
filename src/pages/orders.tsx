import PageContainer from "@jaws/components/atoms/PageContainer";
import OrdersList from "@jaws/components/organisms/OrdersList";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { handleResult } from "@jaws/util";
import type { NextPage } from "next";
import fetch from "node-fetch";
import { useEffect, useState } from "react";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const OrdersPage: NextPage = () => {
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/broker/orders")
      .then(handleResult)
      .then((result) => {
        setData(result.orders);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      {dataFetchStatus === STATUS.READY && <OrdersList data={data} />}
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default OrdersPage;
