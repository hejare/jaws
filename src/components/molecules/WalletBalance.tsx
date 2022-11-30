import { useEffect, useState } from "react";
import { getAccountCashBalance } from "../../services/backendService";
import TextDisplay from "../atoms/TextDisplay";

const WalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("checking...");

  const handleSetBalance = (balance: string) => {
    setWalletBalance(parseFloat(balance).toFixed(2));
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
      <div>Wallet balance</div>
      <div>${walletBalance}</div>
    </TextDisplay>
  );
};

export default WalletBalance;
