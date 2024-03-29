import { getAccountCashBalance } from "@jaws/services/backendService";
import { useEffect, useState } from "react";
import { BoldText } from "../atoms/BoldText";
import TextDisplay from "../atoms/TextDisplay";

const WalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("checking...");

  const handleSetBalance = (balance: number) => {
    setWalletBalance(balance.toFixed());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAccountCashBalance();
        handleSetBalance(result);
      } catch (e) {
        setWalletBalance("Could not get wallet balance");
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay>
      <BoldText>Wallet balance</BoldText>
      <div>${walletBalance}</div>
    </TextDisplay>
  );
};

export default WalletBalance;
