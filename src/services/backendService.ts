import fetch from "node-fetch";
import { convertResult } from "../util";

const baseHeaders = { "Content-Type": "application/json" };

export const setRating = async ({
  breakoutRef,
  userRef,
  value,
}: {
  breakoutRef: string;
  userRef: string;
  value: number;
}) => {
  const resp = await fetch(`/api/data/ratings/${breakoutRef}`, {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({
      userRef,
      value,
    }),
  });

  return convertResult(resp);
};

export const getAccountCashBalance = async () => {
  const resp = await fetch("/api/broker/account/balance", {
    headers: baseHeaders,
  });
  const { balance } = await convertResult(resp);
  return balance;
};
