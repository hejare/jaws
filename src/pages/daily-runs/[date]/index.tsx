import styled from "styled-components";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../../../util";
import DailyRunsList from "../../../components/organisms/DailyRunsList";
import { DailyRunDataType } from "../../../db/dailyRunsMeta";
import { useRouter } from "next/router";
import { isToday } from "../../../lib/helpers";
import TriggerDailyRunButton from "../../../components/molecules/TriggerDailyRunButton";
import { formatDateString } from "../../../util/handleFormatDateString";
import PageContainer from "../../../components/atoms/PageContainer";
import NavButton from "../../../components/atoms/buttons/NavButton";

const ButtonsContainer = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING,
  READY,
}

const DailyRunsDate: NextPage = () => {
  const router = useRouter();
  const { date } = router.query;
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!date || Array.isArray(date)) {
      return;
    }

    fetch(`/api/data/daily-runs/${date}`)
      .then(handleResult)
      .then((result) => {
        let newData = result.map(
          ({
            duration,
            runId,
            status,
            timeEnded,
            timeInitiated,
          }: DailyRunDataType) => ({
            runId,
            status,
            timeInitiated: timeInitiated
              ? new Date(timeInitiated).toUTCString().replace(" GMT", "")
              : "n/a",
            timeEnded: timeEnded
              ? new Date(timeEnded).toUTCString().replace(" GMT", "")
              : "(ongoing)",
            duration,
          }),
        );
        newData = newData.sort((a: DailyRunDataType, b: DailyRunDataType) =>
          b.runId < a.runId ? -1 : b.runId > a.runId ? 1 : 0,
        );
        setData(newData);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [date]);

  if (dataFetchStatus !== STATUS.READY || !date || Array.isArray(date)) {
    return <></>;
  }

  return (
    <PageContainer>
      <NavButton goBack href="">
        Go back
      </NavButton>
      {isToday(formatDateString(date)) && (
        <ButtonsContainer>
          <TriggerDailyRunButton />
        </ButtonsContainer>
      )}
      {dataFetchStatus === STATUS.READY && <DailyRunsList data={data} />}
    </PageContainer>
  );
};

export default DailyRunsDate;
