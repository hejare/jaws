export interface DailyStats {
  accountId: string;
  nav: number;
  shares: number;
  date: string;
  /**
   * TODO: Remove when not needed anymore :)
   * @deprecated don't rely on this for anything
   */
  debugInfo?: Record<string, any>;
}
