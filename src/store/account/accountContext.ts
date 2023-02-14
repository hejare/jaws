import { createContext, useContext } from "react";
import { useStore } from "zustand";
import { AccountState, AccountStore } from "./accountStore";

export const AccountContext = createContext<AccountStore | null>(null);

export const useAccountStore = <T>(
  selector: (state: AccountState) => T,
  equalityFn?: (left: T, right: T) => boolean,
) => {
  const store = useContext(AccountContext);
  if (!store) {
    throw new Error("Missing AccountContext.Provider in component tree");
  }

  return useStore(store, selector, equalityFn);
};
