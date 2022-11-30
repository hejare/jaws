import getNextJSConfig from "next/config";
import Table, { Operations } from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import Ticker from "../atoms/Ticker";
import { memo } from "react";
import { useModal } from "use-modal-hook";
import styled from "styled-components";
import BreakoutModal from "../molecules/BreakoutModal";
import ImageModal from "../molecules/ImageModal";
import Rating from "../molecules/Rating";
import Button from "../atoms/buttons/Button";
import TradeViewButton from "../atoms/buttons/TradeViewButton";

export type PartialBreakoutDataType = {
  image: string;
  tickerRef: string;
  relativeStrength: number;
  breakoutValue: number;
  configRef: string;
  breakoutRef: string;
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
  disableBuy?: boolean;
}
interface ModalProps {
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  rating: number;
  breakoutValue: number;
  symbol: string;
}

const BreakoutsList = ({ data, disableBuy }: Props) => {
  const TheBreakoutModal = memo(
    ({
      isOpen,
      onClose,
      image,
      breakoutRef,
      rating,
      breakoutValue,
      symbol,
    }: ModalProps) => (
      <BreakoutModal
        isOpen={isOpen}
        onClose={onClose}
        image={image}
        breakoutRef={breakoutRef}
        rating={rating}
        breakoutValue={breakoutValue}
        symbol={symbol}
      />
    ),
  );
  const [showBreakoutModal] = useModal(TheBreakoutModal, {});

  const TheImageModal = memo(
    ({ isOpen, onClose, image, breakoutRef, rating }: ModalProps) => (
      <ImageModal
        isOpen={isOpen}
        onClose={onClose}
        image={image}
        currentRating={rating}
        breakoutRef={breakoutRef}
        enableOnClickOutside
      />
    ),
  );
  const [showImageModal] = useModal(TheImageModal, {});

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
    },
    {
      title: "Breakout",
      dataIndex: "breakoutValue",
      key: "breakoutValue",
      width: 100,
    },
    {
      title: "Image",
      dataIndex: "",
      key: "image",
      width: 50,
      className: "image",
      render: (item: PartialBreakoutDataType) => (
        <StyledImage
          onClick={() =>
            showImageModal({
              image: `${IMAGE_SERVICE_BASE_URL as string}/${item.image}`,
              breakoutRef: item.breakoutRef,
              rating: item.rating,
            })
          }
          src={`${IMAGE_SERVICE_BASE_URL as string}/${item.image}`}
        />
      ),
    },
    {
      title: "Rating",
      dataIndex: "",
      key: "rating",
      width: 100,
      render: (item: any) => (
        <Rating initialValue={item.rating} breakoutRef={item.breakoutRef} />
      ),
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "operations",
      render: (item: PartialBreakoutDataType) => (
        <Operations>
          {!disableBuy && (
            <Button
              onClick={() => {
                void showBreakoutModal({
                  image: `${IMAGE_SERVICE_BASE_URL as string}/${item.image}`,
                  breakoutRef: item.breakoutRef,
                  rating: item.rating,
                  symbol: item.tickerRef,
                  breakoutValue: item.breakoutValue,
                });
              }}
            >
              Prepare Order
            </Button>
          )}
          <TradeViewButton symbol={item.tickerRef}>TradeView</TradeViewButton>
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
