import { useEffect, useState } from "react";
import { getWalletBalance } from "../../lib/brokerHandler";
import TextDisplay from "../molecules/TextDisplay";

const DisplayWalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("");

  const handleSetBalance = (balance: string) => {
    setWalletBalance(parseFloat(balance).toFixed(2).toString());
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWalletBalance();
      result && handleSetBalance(result);
    };
    void fetchData();
  }, []);

  return <TextDisplay content={["Wallet balance", walletBalance]} />;
};

export default DisplayWalletBalance;
