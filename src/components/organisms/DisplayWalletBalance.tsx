import { useEffect, useState } from "react";
import { getWalletBalance } from "../../lib/brokerHandler";
import TextDisplay from "../molecules/TextDisplay";

const DisplayWalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWalletBalance();
      result && setWalletBalance(result);
    };
    void fetchData();
  }, []);

  return <TextDisplay content={["Wallet balance", walletBalance]} />;
};

export default DisplayWalletBalance;
