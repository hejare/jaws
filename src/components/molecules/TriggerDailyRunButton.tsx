import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { handleResult } from "../../util";
import fetch from "node-fetch";
import Button from "../atoms/buttons/Button";
import styled from "styled-components";
import { DailyRunStatus } from "../../db/dailyRunsMeta";

export const ONE_MINUTE_IN_MS = 60000;

const TriggerButton = styled(Button)`
  text-align: center;
`;

interface Props {
  handleIndicateIsEnabled?: (state: boolean) => void;
}

const TriggerDailyRunButton = ({ handleIndicateIsEnabled }: Props) => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [buttonNotice, setButtonNotice] = useState<undefined | string>();
  const [interval, setInterval] = useState(0);

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    fetch("/api/data/daily-runs/status")
      .then(handleResult)
      .then(({ status, error = null }) => {
        setButtonEnabled(status !== DailyRunStatus.INITIATED);
        handleIndicateIsEnabled &&
          handleIndicateIsEnabled(status !== DailyRunStatus.INITIATED);
        setButtonNotice(error?.message);
      })
      .catch((e) => {
        setButtonEnabled(false);
        setButtonNotice(e.message);
      });
  }, interval);

  const triggerDailyRun = () => {
    fetch("/api/sharkster/trigger-daily-run")
      .then(handleResult)
      .then(({ status, runId, message = null }) => {
        console.log({ status, runId, message });
      })
      .catch((e) => {
        console.error("Something went wrong :(", e);
      });
    setButtonEnabled(false);
    setButtonNotice("Initiated");
  };

  return (
    <TriggerButton
      onClick={triggerDailyRun}
      disabled={!buttonEnabled}
      title={buttonNotice}
    >
      Trigger Daily Run
    </TriggerButton>
  );
};

export default TriggerDailyRunButton;
