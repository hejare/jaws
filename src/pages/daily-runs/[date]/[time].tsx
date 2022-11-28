import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "../../../util";
import { DailyRunDataType } from "../../../db/dailyRunsMeta";
import {
  BreakoutWithRatingDataType,
  ExistingBreakoutDataType,
} from "../../../db/breakoutsEntity";
import BreakoutsList, {
  PartialBreakoutDataType,
} from "../../../components/organisms/BreakoutsList";
import { handleLimitPrice } from "../../../util/handleLimitPrice";
import { ErrorDataParsedType } from "../../../db/errorsMeta";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING = "LOADING",
  READY = "READY",
}

const ErrorContainer = styled.div`
  border: 1px solid red;
  margin: 4px;
  padding: 4px;
`;

interface DailyRunFetchDataType extends DailyRunDataType {
  breakouts?: ExistingBreakoutDataType[];
  error?: ErrorDataParsedType;
}

const DailyRun: NextPage = () => {
  const router = useRouter();
  const { date, time } = router.query;
  const dateString = `${date as string}`;
  const [dataFetchStatus, setDataFetchStatus] = useState(STATUS.LOADING);
  const [dailyRun, setDailyRun] = useState<DailyRunDataType>();
  const [breakoutsData, setBreakoutsData] = useState<PartialBreakoutDataType[]>(
    [],
  );

  useEffect(() => {
    fetch(`/api/data/daily-runs/${date as string}/${time as string}`)
      .then(handleResult)
      .then((result: DailyRunFetchDataType) => {
        setDailyRun(result);

        if (result.breakouts) {
          let newBreakoutsData = result.breakouts.map(
            ({
              image,
              tickerRef,
              relativeStrength,
              breakoutValue,
              configRef,
              _ref: breakoutRef,
              rating,
            }: BreakoutWithRatingDataType) => ({
              breakoutRef,
              tickerRef,
              relativeStrength,
              breakoutValue: handleLimitPrice(breakoutValue),
              configRef,
              image,
              rating,
            }),
          );
          newBreakoutsData = newBreakoutsData.sort((a, b) =>
            b.tickerRef < a.tickerRef ? 1 : b.tickerRef > a.tickerRef ? -1 : 0,
          );
          setBreakoutsData(newBreakoutsData);
        }
        setDataFetchStatus(STATUS.READY);
      })
      .catch(console.error);
  }, [date, time]);

  const isDateToday = (date: string) => {
    const currentDate = new Date().setHours(0, 0, 0);
    const compareDate = new Date(
      `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`,
    ).setHours(0, 0, 0);

    if (currentDate !== compareDate) {
      return false;
    }

    return true;
  };

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
          {dailyRun.error && (
            <ErrorContainer>
              <div>Message: {dailyRun.error.message}</div>
              <div>cell: {dailyRun.error.misc.cell}</div>
              <div>rangeStart: {dailyRun.error.misc.rangeStart}</div>
              <div>rangeEnd: {dailyRun.error.misc.rangeEnd}</div>
              <div>symbols: {JSON.stringify(dailyRun.error.misc.symbols)}</div>
            </ErrorContainer>
          )}
          <div>
            {dailyRun.timeInitiated && (
              <span>
                Initiated:{" "}
                {new Date(dailyRun.timeInitiated)
                  .toUTCString()
                  .replace(" GMT", "")}
              </span>
            )}
            <span>
              Ended: {dailyRun.timeEnded} ({dailyRun.duration}s)
            </span>
          </div>
        </div>
      )}
      <BreakoutsList
        data={breakoutsData}
        disableBuy={!isDateToday(dateString)}
      />
    </PageContainer>
  );
};

export default DailyRun;
