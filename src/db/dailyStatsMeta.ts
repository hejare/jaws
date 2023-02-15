export interface DailyStats {
  accountId: string;
  nav: number;
  shares: number;
  date: string;
  /** TODO: Remove when not needed anymore :) */
  debugInfo?: Record<string, any>;
}
