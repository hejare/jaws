import { createContext } from "react";
import { AccountStore } from "./accountStore";

export const AccountContext = createContext<AccountStore | null>(null);
