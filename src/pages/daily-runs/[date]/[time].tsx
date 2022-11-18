import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../../../util";
import { DailyRunDataType } from "../../../db/dailyRunsMeta";
import { BreakoutDataType } from "../../../db/breakoutsEntity";
import BreakoutsList, {
  PartialBreakoutDataType,
} from "../../../components/organisms/BreakoutsList";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

enum STATUS {
  LOADING,
  READY,
}

interface DailyRunFetchDataType extends DailyRunDataType {
  breakouts: BreakoutDataType[];
}

const DailyRun: NextPage = () => {
  const router = useRouter();
  const { date, time } = router.query;
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [dailyRun, setDailyRun] = useState<DailyRunDataType>();
  const [breakoutsData, setBreakoutsData] = useState<PartialBreakoutDataType[]>(
    [],
  );

  // const runId = `${date as string}_${time as string}`;

  useEffect(() => {
    fetch(`/api/data/daily-runs/${date as string}/${time as string}`)
      .then(handleResult)
      .then((result: DailyRunFetchDataType) => {
        setDailyRun(result);
        const newBreakoutsData = result.breakouts.map(
          ({
            image,
            tickerRef,
            relativeStrength,
            breakoutValue,
            configRef,
          }: BreakoutDataType) => ({
            tickerRef,
            relativeStrength,
            breakoutValue,
            configRef,
            image,
          }),
        );
        setBreakoutsData(newBreakoutsData);
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [date, time]);

  return (
    <PageContainer>
      <h1>DAILY RUN</h1>
      <h3>
        Date: {date} (Time: {time})
      </h3>
      {dailyRun && dataFetchStatus === STATUS.READY && (
        <div>
          <div>
            <span>Id: {dailyRun.runId}</span>
          </div>
          <div>
            <span>Status: {dailyRun.status}</span>
          </div>
          <div>
            <span>
              Initiated:{" "}
              {new Date(dailyRun.timeInitiated)
                .toUTCString()
                .replace(" GMT", "")}
            </span>
            <span>
              Ended: {dailyRun.timeEnded} ({dailyRun.duration}s)
            </span>
          </div>
        </div>
      )}
      <BreakoutsList data={breakoutsData} />
    </PageContainer>
  );
};

export default DailyRun;
