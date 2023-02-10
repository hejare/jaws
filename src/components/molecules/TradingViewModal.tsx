import { TradeViewWidget } from "../atoms/TradeViewWidget";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  enableOnClickOutside?: boolean;
  symbol: string;
}

export default function TradingViewModal({
  isOpen,
  onClose,
  enableOnClickOutside = true,
  symbol,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      enableOnClickOutside={enableOnClickOutside}
    >
      <TradeViewWidget ticker={symbol}></TradeViewWidget>
    </Modal>
  );
}
