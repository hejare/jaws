import getNextJSConfig from "next/config";
import Table, { Operations } from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import Ticker from "../atoms/Ticker";
import NavButton from "../atoms/buttons/NavButton";
import { handleBuyOrder } from "../../lib/brokerHandler";
import { memo } from "react";
import { useModal } from "use-modal-hook";
import styled from "styled-components";
import BreakoutModal from "../molecules/BreakoutModal";
import IndicateLoadingButton from "../molecules/IndicateLoadingButton";
import Rating from "../molecules/Rating";

export type PartialBreakoutDataType = {
  image: { image: string; breakoutRef: string; rating?: number };
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  rating?: number;
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
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  rating: number;
}

const BreakoutsList = ({ data }: Props) => {
  const MyModal = memo(
    ({ isOpen, onClose, image, breakoutRef, rating }: ModalProps) => (
      <BreakoutModal
        isOpen={isOpen}
        onClose={onClose}
        image={image}
        breakoutRef={breakoutRef}
        rating={rating}
      />
    ),
  );
  const [showModal] = useModal(MyModal, {});

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
      render: (imageData: {
        image: string;
        breakoutRef: string;
        rating: string;
      }) => (
        <StyledImage
          onClick={() =>
            showModal({
              image: `${IMAGE_SERVICE_BASE_URL as string}/${imageData.image}`,
              breakoutRef: imageData.breakoutRef,
              rating: imageData.rating,
            })
          }
          src={`${IMAGE_SERVICE_BASE_URL as string}/${imageData.image}`}
        />
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating: number) => <Rating currentRating={rating} />,
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "operations",
      render: (item: any) => (
        <Operations>
          <IndicateLoadingButton
            onClick={async () => {
              console.log(console.log("BUYING this breakout...:", item));
              await handleBuyOrder(item.tickerRef, item.breakoutValue);
            }}
          >
            Place Order
          </IndicateLoadingButton>
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
