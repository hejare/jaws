import getNextJSConfig from "next/config";
import Table, { Operations } from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import Ticker from "../atoms/Ticker";
import NavButton from "../atoms/buttons/NavButton";
import { memo } from "react";
import { useModal } from "use-modal-hook";
import styled from "styled-components";
import BreakoutModal from "../molecules/BreakoutModal";
import ImageModal from "../molecules/ImageModal";
import Rating from "../molecules/Rating";
import * as backendService from "../../services/backendService";
import Button from "../atoms/buttons/Button";

export type PartialBreakoutDataType = {
  image: string;
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

  const TheImageModal = memo(({ isOpen, onClose, image }: ModalProps) => (
    <ImageModal
      isOpen={isOpen}
      onClose={onClose}
      image={image}
      enableOnClickOutside
    />
  ));
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

  const handleSetRating = (breakoutRef: string, value: number) => {
    const userRef = "ludde@hejare.se"; // TODO
    console.log({ breakoutRef, userRef, value });
    void backendService.setRating({ breakoutRef, userRef, value });
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
      title: "Breakout",
      dataIndex: "breakoutValue",
      key: "breakoutValue",
      width: 100,
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
            showImageModal({
              image: `${IMAGE_SERVICE_BASE_URL as string}/${image}`,
            })
          }
          src={`${IMAGE_SERVICE_BASE_URL as string}/${image}`}
        />
      ),
    },
    {
      title: "Rating",
      dataIndex: "",
      key: "rating",
      width: 100,
      render: (item: any) => (
        <Rating
          currentRating={item.rating}
          handleSetRating={(value) => handleSetRating(item.breakoutRef, value)}
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
            disabled={disableBuy}
            onClick={() => {
              void showBreakoutModal({
                image: `${IMAGE_SERVICE_BASE_URL as string}/${
                  item.image as string
                }`,
                breakoutRef: item.breakoutRef,
                rating: item.rating,
                symbol: item.tickerRef,
                breakoutValue: item.breakoutValue,
              });
            }}
          >
            Prepare Order
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
