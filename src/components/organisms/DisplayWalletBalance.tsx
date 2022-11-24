import { useEffect, useState } from "react";
import { getWalletBalance } from "../../lib/brokerHandler";
import TextDisplay from "../atoms/TextDisplay";

const DisplayWalletBalance = () => {
  const [walletBalance, setWalletBalance] = useState<string>("checking...");

  const handleSetBalance = (balance: string) => {
    setWalletBalance(parseFloat(balance).toFixed(2));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWalletBalance();
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
      <>
        <div>Wallet balance</div> <div>{walletBalance}</div>
      </>
    </TextDisplay>
  );
};

export default DisplayWalletBalance;