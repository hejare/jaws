import type { NextPage } from "next";
import OrdersList from "../components/organisms/OrdersList";
import { useEffect, useState } from "react";
import { handleResult } from "../util";
import fetch from "node-fetch";
import PageContainer from "../components/atoms/PageContainer";
import { getServerSidePropsAllPages } from "../lib/getServerSidePropsAllPages";

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
