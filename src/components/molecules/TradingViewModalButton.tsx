import { useState } from "react";
import Button from "../atoms/buttons/Button";
import TradingViewModal from "./TradingViewModal";

export interface Props {
  symbol: string;
}

export default function TradingViewModalButton({ symbol }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>TradingView</Button>
      <TradingViewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        symbol={symbol}
      ></TradingViewModal>
    </>
  );
}
