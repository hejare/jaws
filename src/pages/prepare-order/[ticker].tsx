import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/atoms/buttons/Button";
import NavButton from "../../components/atoms/buttons/NavButton";
import PageContainer from "../../components/atoms/PageContainer";
import TextDisplay from "../../components/atoms/TextDisplay";
import InfoBar from "../../components/molecules/InfoBar";
import TickerBreakoutList, {
  BreakoutData,
} from "../../components/organisms/TickerBreakoutList";
import { getServerSidePropsAllPages } from "../../lib/getServerSidePropsAllPages";
import { handleResult } from "../../util";
import { PartialOrderDataType } from "../tickers/[ticker]";
import getNextJSConfig from "next/config";
import Graph from "../../components/molecules/Graph";
import { TradeViewWidget } from "../../components/atoms/TradeViewWidget";

const { publicRuntimeConfig } = getNextJSConfig();
const { IMAGE_SERVICE_BASE_URL = "[NOT_DEFINED_IN_ENV]" } = publicRuntimeConfig;

const TickerPageContainer = styled.div`
  margin: 20px;
  width: 100%;
  height: 80vh;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  grid-template-areas:
    "graph graph graph sidebar"
    "table table table table";
  gap: 10px;
`;

const TickerPage: NextPage = () => {
  const router = useRouter();
  const { ticker } = router.query;
  const [breakouts, setBreakouts] = useState<BreakoutData[]>([]);

  useEffect(() => {
    // TODO use store do not fetch from here
    if (!ticker || Array.isArray(ticker)) {
      return;
    }
    fetch(`/api/data/tickers/breakouts/${ticker}`)
      .then(handleResult)
      .then((result) => {
        setBreakouts(result.breakouts);
      })
      .catch(console.error);
  }, [ticker]);

  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>
      <h1>{`${ticker.toUpperCase()}`}</h1>
      <TickerPageContainer>
        <div style={{ gridArea: "graph" }}>
          {breakouts[0] ? <Graph {...breakouts[0]} /> : <div>no data...</div>}
        </div>
        <div style={{ gridArea: "sidebar" }}>
          <InfoBar>
            <TextDisplay>
              <div>Breakout value: {"breakouts[0].breakoutValue"}</div>
              <div>Amount</div>
              <div>Edit!</div>
              <button>buy</button>
            </TextDisplay>
          </InfoBar>
        </div>
        <div style={{ gridArea: "table" }}>
          <TickerBreakoutList
            data={breakouts}
            titleText={`Breakouts for ${ticker.toUpperCase()}`}
          />
        </div>
      </TickerPageContainer>
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default TickerPage;
