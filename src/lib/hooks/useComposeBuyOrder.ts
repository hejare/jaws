import * as backendService from "@jaws/services/backendService";
import { useCallback, useEffect, useState } from "react";
import { getBuySellHelpers } from "../buySellHelper/buySellHelper";

export const useComposeBuyOrder = (): {
  quantity: number;
  maxOrderValue: number;
  setPrice: (price: number) => void;
  cashBalance: number;
  price: number;
} => {
  const [buyOrderDetails, setBuyOrderDetails] = useState<{
    quantity: number;
    maxOrderValue: number;
  }>({ quantity: -1, maxOrderValue: -1 });

  const [cashBalance, setCashBalance] = useState<number>(-1);
  const [equity, setEquity] = useState<number>(-1);

  const [inputPrice, setInputPrice] = useState<number>();

  // get account info
  useEffect(() => {
    void Promise.all([
      backendService.getAccountEquity(),
      backendService.getAccountCashBalance(),
    ]).then(([_equity, _cashBalance]) => {
      setCashBalance(_cashBalance);
      setEquity(_equity);
    });
  }, []);

  useEffect(() => {
    if (!inputPrice) {
      return;
    }

    const helpers = getBuySellHelpers();
    setBuyOrderDetails(
      helpers.getBuyOrderQuantity({
        equity,
        cashBalance,
        entryPrice: inputPrice,
      }),
    );
  }, [cashBalance, equity, inputPrice]);

  const setPrice = useCallback((price: number) => setInputPrice(price), []);

  return {
    ...buyOrderDetails,
    setPrice,
    cashBalance,
    price: inputPrice || -1,
  };
};
