export function calculateNAV({
  numShares,
  equity,
  cashFlow,
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
  cashFlow: number;
}): { NAV: number; newNumShares: number } {
  const navWithoutCashflow = (equity - cashFlow) / numShares;
  const newNumShares = numShares + cashFlow / navWithoutCashflow;
  const newNAV = equity / newNumShares;

  return { NAV: newNAV, newNumShares };
}
