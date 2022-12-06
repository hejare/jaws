import type { NextPage } from "next";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import { BoldText } from "../../components/atoms/BoldText";
import NavButton from "../../components/atoms/buttons/NavButton";
import PageContainer from "../../components/atoms/PageContainer";
import TextDisplay from "../../components/atoms/TextDisplay";
import { getServerSidePropsAllPages } from "../../lib/getServerSidePropsAllPages";
import { handleResult } from "../../util";

export type PartialOrderDataType = {
  created_at?: string;
  filled_at?: string;
  notional?: string;
  symbol?: string;
};

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

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
  const configPropNames = Object.keys(config);
  configPropNames.sort();
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
                <BoldText>
                  {typeof config[name] === "boolean"
                    ? JSON.stringify(config[name])
                    : config[name]}
                </BoldText>
              </div>
            ),
        )}
      </TextDisplay>
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default ConfigPage;
