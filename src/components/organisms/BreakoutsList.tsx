import getNextJSConfig from "next/config";
import Button from "../atoms/buttons/Button";
import Table, { Operations } from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import Ticker from "../atoms/Ticker";
import NavButton from "../atoms/buttons/NavButton";
import { handleBuyOrder } from "../../lib/brokerHandler";
import { memo } from "react";
import { useModal } from "use-modal-hook";
import styled from "styled-components";
import BreakoutModal from "../molecules/BreakoutModal";

export type PartialBreakoutDataType = {
  image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
};
// const cancellableStatus = [DailyRunStatus.INITIATED] as const;
const nonCancellableStatus = [DailyRunStatus.COMPLETED] as const;

const { publicRuntimeConfig } = getNextJSConfig();
const { IMAGE_SERVICE_BASE_URL = "[NOT_DEFINED_IN_ENV]" } = publicRuntimeConfig;

const StyledImage = styled.img`
  cursor: pointer;
  :hover {
    border: 1px solid ${({ theme }) => theme.palette.actionHover.border};
  }
`;
interface Props {
  data: PartialBreakoutDataType[];
}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

const BreakoutsList = ({ data }: Props) => {
  const MyModal = memo(({ isOpen, onClose, image }: ModalProps) => (
    <BreakoutModal isOpen={isOpen} onClose={onClose} image={image} />
  ));
  const [showModal, hideModal] = useModal(MyModal, {});

  const renderTitle = () => {
    return <h2>Breakouts</h2>;
  };

  const renderFooter = () => {
    return (
      <>
        <hr />
      </>
    );
  };

  const columns = [
    {
      title: "Ticker",
      dataIndex: "tickerRef",
      key: "tickerRef",
      width: 100,
      render: (tickerRef: string) => <Ticker id={tickerRef} />,
    },
    // {
    //   title: "Relative Strength",
    //   dataIndex: "relativeStrength",
    //   key: "relativeStrength",
    //   width: 200,
    // },
    {
      title: "Breakout Value",
      dataIndex: "breakoutValue",
      key: "breakoutValue",
      width: 200,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 50,
      className: "image",
      render: (image: string) => (
        <StyledImage
          onClick={() =>
            showModal({ image: `${IMAGE_SERVICE_BASE_URL as string}/${image}` })
          }
          src={`${IMAGE_SERVICE_BASE_URL as string}/${image}`}
        />
      ),
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "operations",
      render: (item: any) => (
        <Operations>
          <Button
            onClick={async () => {
              console.log(console.log("BUYING this breakout...:", item));
              await handleBuyOrder(item.tickerRef, item.breakoutValue);
            }}
          >
            Place Order
          </Button>
          <NavButton
            href={`https://www.tradingview.com/symbols/${
              item.tickerRef as string
            }`}
          >
            TradeView
          </NavButton>
        </Operations>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={() => Math.random()}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default BreakoutsList;
