import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { handleResult } from "../../util";
import fetch from "node-fetch";
import Button from "../atoms/buttons/Button";
import styled from "styled-components";

export const ONE_MINUTE_IN_MS = 60000;

const TriggerButton = styled(Button)`
  text-align: center;
`;

const TriggerDailyRunButton = () => {
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [buttonNotice, setButtonNotice] = useState<undefined | string>();
  const [interval, setInterval] = useState(0);

  useInterval(() => {
    setInterval(ONE_MINUTE_IN_MS);
    fetch("/api/sharkster/check-breakouts-state")
      .then(handleResult)
      .then(({ isIdle, message = null }) => {
        setButtonEnabled(isIdle);
        setButtonNotice(message);
      })
      .catch((e) => {
        setButtonEnabled(false);
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
