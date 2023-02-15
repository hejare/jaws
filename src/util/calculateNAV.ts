export function calculateNAV({
  numShares,
  equity,
  netDeposits,
}: {
  /**
   * Number of shares outsanding (of Jaws account)
   */
  numShares: number;
  /**
   * Cash + market value
   */
  equity: number;
  /**
   * How much cash has been added (or withdrawn) since the last NAV
   * calculation. This cash flow should already be included in `equity`
   */
  netDeposits: number;
}): {
  /**
   * New NAV
   */
  NAV: number;
  /**
   * How many shares exist including newly created or removed shares due
   * to deposits/withdrawals
   */
  newNumShares: number;
} {
  const navWithoutCashDiff = (equity - netDeposits) / numShares;
  const newNumShares = numShares + netDeposits / navWithoutCashDiff;
  const newNAV = equity / newNumShares;

  return { NAV: newNAV, newNumShares };
}
