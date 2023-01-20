import { BreakoutDataType, upsertBreakout } from "@jaws/db/breakoutsEntity";
import { getLatestConfig, postConfig } from "@jaws/db/configsEntity";
import {
  getDailyRun,
  postDailyRun,
  putDailyRun,
} from "@jaws/db/dailyRunsEntity";
import { DailyRunDataType, DailyRunStatus } from "@jaws/db/dailyRunsMeta";
import { postError } from "@jaws/db/errorsEntity";
import { upsertTicker } from "@jaws/db/tickersEntity";
import { triggerDailyRun } from "@jaws/services/sharksterService";
import { postSlackMessage } from "@jaws/services/slackService";
import { getNewRunId } from "./helpers";

interface BreakoutNoImage {
  relative_strength: number;
  breakout_level: number;
  symbol: string;
}
interface Breakout extends BreakoutNoImage {
  image: string;
}

type Config = Record<string, string | number>;

type DailyRunBody = {
  runId: string;
  breakouts: Breakout[];
  config: Config;
  duration: number;
  rangeStart: number;
  rangeEnd: number;
};

type DailyRunErrorBody = {
  runId: string;
  message: string;
  cell: string;
  rangeStart: number;
  rangeEnd: number;
};

const isNotebookIdle = (
  sessions: [{ path: string; kernel: { execution_state: string } }],
) => {
  const nonIdleSession = sessions.find(
    (session) => session.kernel.execution_state !== "idle",
  );
  return !nonIdleSession;
};

export const triggerDailyrun = async () => {
  // const sessions = await getSessions();
  // NOTE: I comment this part out for now, since it was blocking the daily-runs when a "unknown" anaconda process was not in "idle" state.
  // TODO: Should be investigated further in the future.
  // const isIdle = isNotebookIdle(sessions);
  // if (!isIdle) {
  //   return Promise.reject(
  //     new Error(
  //       "Process is not idle. Could be due to previous execution is still ongoing.",
  //     ),
  //   );
  // }
  const newRunId = getNewRunId();
  await postDailyRun(newRunId);
  void triggerDailyRun(newRunId);
  return Promise.resolve(newRunId);
};

const isConfigSame = (configA: Config, configB: Config) => {
  const confA: Record<string, any> = {
    ...configA,
    _ref: null,
    timestamp: null,
  };

  const confB: Record<string, any> = {
    ...configB,
    _ref: null,
    timestamp: null,
  };

  const confAEntities = Object.keys(confA);
  const confBEntities = Object.keys(confB);

  if (confAEntities.length !== confBEntities.length) {
    return false;
  }

  const foundMissmatches = confAEntities.reduce((result, configName) => {
    return result + (confA[configName] !== confB[configName] ? 1 : 0);
  }, 0);
  return !foundMissmatches;
};

export const storeDailyRun = async (dailyRunBody: DailyRunBody) => {
  const { runId, config, breakouts, duration, rangeStart, rangeEnd } =
    dailyRunBody;

  // update DailyRun
  let dailyRun: null | DailyRunDataType = await getDailyRun(runId);

  if (dailyRun === null) {
    dailyRun = await postDailyRun(runId);
  }

  await putDailyRun(runId, {
    ...dailyRun,
    status: DailyRunStatus.COMPLETED,
    duration: duration,
    timeEnded: Date.now(),
    breakoutsCount: breakouts.length,
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
  });

  // Get/Post config
  const newConfig = {
    ...config,
    timestamp: Date.now(),
  };
  const latestConfig = await getLatestConfig();
  let configRef: string | undefined = latestConfig?._ref;

  let configIsNew = false;
  if (!configRef || (latestConfig && !isConfigSame(latestConfig, newConfig))) {
    const { _ref } = await postConfig(newConfig);
    configRef = _ref;
    configIsNew = true;
  }

  const promises = breakouts.map((breakout) => {
    async function handleBreakout() {
      const { relative_strength, breakout_level, image, symbol } = breakout;

      await upsertTicker(symbol); // symbol === tickerRef

      // Please linting:
      if (!configRef) {
        return;
      }

      // Post Breakout for each breakout item
      const breakoutData: BreakoutDataType = {
        dailyRunRef: runId,
        configRef,
        tickerRef: symbol,
        relativeStrength: relative_strength,
        breakoutValue: breakout_level,
        image,
      };
      await upsertBreakout(breakoutData);
    }
    return handleBreakout();
  });
  await Promise.all(promises);
  await postSlackMessage(
    runId,
    breakouts.length,
    configIsNew ? configRef : null,
  );
};

export const storeDailyRunError = async (dailyRunBody: DailyRunErrorBody) => {
  const { runId, message, cell, rangeStart, rangeEnd } = dailyRunBody;

  console.log("Sharkster message:", { message, runId, cell });
  await postError(runId, message, {
    cell,
    rangeStart,
    rangeEnd,
  });

  // update DailyRun
  const dailyRun: null | DailyRunDataType = await getDailyRun(runId);
  const nowTimestamp = Date.now();

  await putDailyRun(runId, {
    ...(dailyRun || {
      timeInitiated: nowTimestamp,
      breakoutsCount: 0,
    }),
    runId,
    rangeStart,
    rangeEnd,
    status: DailyRunStatus.ERROR,
    duration:
      dailyRun && dailyRun.timeInitiated
        ? nowTimestamp - new Date(dailyRun.timeInitiated).getTime()
        : 0,
    timeEnded: nowTimestamp,
  });
};
