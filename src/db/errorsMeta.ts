export type ErrorDataParsedType = {
  runId: string;
  message: string;
  misc: Record<string, any>;
  timestamp: number;
};

export type ErrorDataDBType = {
  runId: string;
  message: string;
  miscJson: string;
  timestamp: number;
};
