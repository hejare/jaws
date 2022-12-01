import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavButton from "../../components/atoms/buttons/NavButton";
import PageContainer from "../../components/atoms/PageContainer";
import TextDisplay from "../../components/atoms/TextDisplay";
import { handleResult } from "../../util";

export type PartialOrderDataType = {
  created_at?: string;
  filled_at?: string;
  notional?: string;
  symbol?: string;
};

export type PartialBreakoutDataType = {
  image?: string;
  tickerRef?: string;
  relativeStrength?: number;
  breakoutValue?: number;
  configRef?: string;
};

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const Value = styled.span`
  font-size: 1.2em;
  font-family: "Roboto-Black";
`;
const ConfigPage: NextPage = () => {
  const [config, setConfig] = useState();
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);

  const router = useRouter();
  const { id: configId } = router.query;

  useEffect(() => {
    if (!configId || Array.isArray(configId)) {
      return;
    }

    fetch(`/api/data/configs/${configId}`)
      .then(handleResult)
      .then((result) => {
        setConfig(result);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [configId]);

  if (dataFetchStatus !== STATUS.READY || !config || Array.isArray(config)) {
    return <></>;
  }

  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>
      <h1>Config ({configId})</h1>
      <TextDisplay>
        {Object.keys(config).map(
          (name: string, i: number) =>
            name !== "_ref" && (
              <div key={i}>
                {name}:{" "}
                <Value>
                  {typeof config[name] === "boolean"
                    ? JSON.stringify(config[name])
                    : config[name]}
                </Value>
              </div>
            ),
        )}
      </TextDisplay>
    </PageContainer>
  );
};

export default ConfigPage;
