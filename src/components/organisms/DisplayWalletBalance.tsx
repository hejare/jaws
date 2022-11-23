import { useEffect, useState } from "react";
import { getWalletBalance } from "../../lib/brokerHandler";
import TextDisplay from "../atoms/TextDisplay";

const DisplayWalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("checking...");

  const handleSetBalance = (balance: string) => {
    setWalletBalance(parseFloat(balance).toFixed(2).toString());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWalletBalance();
        handleSetBalance(result);
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay
      content={[
        "Wallet balance",
        walletBalance ? walletBalance : "Could not get wallet balance",
      ]}
    />
  );
};

export default DisplayWalletBalance;
