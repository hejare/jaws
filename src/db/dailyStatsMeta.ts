import { firestore } from "firebase-admin";

export interface DailyStats {
  accountId: string;
  nav: number;
  shares: number;
  date: firestore.Timestamp;
  /**
   * TODO: Remove when not needed anymore :)
   * @deprecated don't rely on this for anything
   */
  debugInfo?: Record<string, any>;
}
