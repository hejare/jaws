import styled from "styled-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fetch from "node-fetch";
import { handleResult } from "@jaws/util";
import { DailyRunDataType } from "@jaws/db/dailyRunsMeta";
import {
  BreakoutWithRatingDataType,
  ExistingBreakoutDataType,
} from "../../../../db/breakoutsEntity";
import BreakoutsList from "@jaws/components/organisms/BreakoutsList";
import { handleLimitPrice } from "@jaws/util/handleLimitPrice";
import { ErrorDataParsedType } from "@jaws/db/errorsMeta";
import {
  formatDateString,
  formatTimestampToUtc,
  formatTimeString,
} from "../../../../util/handleFormatDateString";
import { isToday } from "@jaws/lib/helpers";
import NavButton from "@jaws/components/atoms/buttons/NavButton";
import PageContainer from "@jaws/components/atoms/PageContainer";
import { getServerSidePropsAllPages } from "@jaws/lib/getServerSidePropsAllPages";
import { useBreakoutsStore } from "@jaws/store/breakoutsStore";
import Button from "@jaws/components/atoms/buttons/Button";
import { ButtonsContainer } from "@jaws/components/atoms/ButtonsContainer";

// eslint-disable-next-line no-unused-vars
enum STATUS {
  LOADING = "LOADING",
  READY = "READY",
}

const ErrorContainer = styled.div`
  overflow: scroll;
  max-width: 90vw;
  border: 1px solid red;
  margin: 4px;
  padding: 4px;
`;

const ErrorButton = styled(Button)`
  background-color: ${({ theme }) => theme.palette.text.error};
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
  const [errorsVisible, setErrorsVisible] = useState(false);

  const [breakoutsData, setBreakoutsData] = useBreakoutsStore((state) => [
    state.breakouts,
    state.setBreakouts,
  ]);

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

  if (dataFetchStatus !== STATUS.READY || !time || Array.isArray(time)) {
    return <></>;
  }

  const configId = breakoutsData.length > 0 ? breakoutsData[0].configRef : null;
  return (
    <PageContainer>
      <ButtonsContainer>
        {configId && (
          <NavButton href={`/configs/${configId}`}>
            View Configuration
          </NavButton>
        )}
        {dailyRun && dailyRun.errors && dailyRun.errors.length > 0 && (
          <ErrorButton onClick={() => setErrorsVisible(!errorsVisible)}>
            {errorsVisible ? "Hide" : "Show"} {dailyRun.errors.length} errors!
          </ErrorButton>
        )}
        <NavButton goBack href="">
          Go back
        </NavButton>
      </ButtonsContainer>

      <h1>DAILY RUN</h1>
      <h3>
        Date: {date} (Time: {formatTimeString(time)})
      </h3>
      {dailyRun && dataFetchStatus === STATUS.READY && (
        <div>
          <div>
            <span>Id: {dailyRun.runId}</span>
          </div>
          <div>
            <span>Status: {dailyRun.status}</span>
          </div>

          {errorsVisible &&
            dailyRun.errors &&
            dailyRun.errors.map((error: any, idx: number) => (
              <ErrorContainer key={idx}>
                <div>Message: {error.message}</div>
                <div>cell: {error.misc.cell}</div>
              </ErrorContainer>
            ))}
          <div>
            {dailyRun.timeInitiated && (
              <div>
                Initiated: {formatTimestampToUtc(dailyRun.timeInitiated)}
              </div>
            )}
            <div>
              Ended:{" "}
              {dailyRun.timeEnded
                ? `${formatTimestampToUtc(dailyRun.timeEnded)}
                (${(dailyRun.duration / 60).toFixed(2)}min)`
                : "(ongoing)"}
            </div>
          </div>
          <div>
            Symbol Range: {dailyRun.rangeStart}-{dailyRun.rangeEnd}
          </div>
        </div>
      )}
      <BreakoutsList
        data={breakoutsData}
        date={date as string}
        time={time}
        disableBuy={!isToday(formatDateString(dateString))}
      />
    </PageContainer>
  );
};

export const getServerSideProps = getServerSidePropsAllPages;
export default DailyRun;
