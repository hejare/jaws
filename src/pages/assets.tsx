import styled from "styled-components";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../util";
import AssetsList from "../components/organisms/AssetsList";
import PageContainer from "../components/atoms/PageContainer";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const AssetsPage: NextPage = () => {
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/broker/account/assets")
      .then(handleResult)
      .then((result) => {
        setData(result.assets);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      {dataFetchStatus === STATUS.READY && <AssetsList data={data} />}
    </PageContainer>
  );
};

export default AssetsPage;
