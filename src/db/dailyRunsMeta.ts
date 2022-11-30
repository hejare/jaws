export enum DailyRunStatus {
  INITIATED = "INITIATED",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export type DailyRunDataType = {
  status: DailyRunStatus;
  runId: string;
  duration: number;
  timeInitiated?: number;
  timeEnded: number;
  breakoutsCount: number;
  rangeStart: number;
  rangeEnd: number;
  error?: {
    message: string;
    timestamp: number;
    misc: Record<string, any>;
  };
};
