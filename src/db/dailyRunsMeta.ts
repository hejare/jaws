export enum DailyRunStatus {
  INITIATED = "INITIATED",
  COMPLETED = "COMPLETED",
}

export type DailyRunDataType = {
  status: DailyRunStatus;
  runId: string;
  duration: number;
  timeInitiated: number;
  timeEnded: number;
};
