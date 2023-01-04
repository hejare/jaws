import getNextJSConfig from "next/config";
import Table, { Operations } from "../atoms/Table";
import { DailyRunStatus } from "../../db/dailyRunsMeta";
import { memo } from "react";
import { useModal } from "use-modal-hook";
import styled from "styled-components";
import BreakoutModal from "../molecules/BreakoutModal";
import ImageModal from "../molecules/ImageModal";
import Rating from "../molecules/Rating";
import Button from "../atoms/buttons/Button";
import { BreakoutStoreType } from "../../store/breakoutsStore";
import NavButton from "../atoms/buttons/NavButton";
import CancelOrderButton from "../molecules/CancelOrderButton";

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
  data: BreakoutStoreType[];
  disableBuy?: boolean;
}
interface ModalProps {
  breakoutRef: string;
  isOpen: boolean;
  onClose: () => void;
  image: string;
  breakoutValue: number;
  symbol: string;
  breakoutIndex: number;
  allBreakouts: BreakoutStoreType[];
  showBreakoutModal: (props: ModalProps) => void;
}

const BreakoutsList = ({ data, disableBuy }: Props) => {
  const TheBreakoutModal = memo(
    ({
      isOpen,
      onClose,
      image,
      breakoutRef,
      breakoutValue,
      symbol,
      breakoutIndex,
      allBreakouts,
      showBreakoutModal,
    }: ModalProps) => (
      <BreakoutModal
        isOpen={isOpen}
        onClose={onClose}
        image={image}
        breakoutRef={breakoutRef}
        breakoutValue={breakoutValue}
        symbol={symbol}
        breakoutIndex={breakoutIndex}
        allBreakouts={allBreakouts}
        showBreakoutModal={showBreakoutModal}
      />
    ),
  );
  const [showBreakoutModal] = useModal(TheBreakoutModal, {});

  const TheImageModal = memo(
    ({ isOpen, onClose, image, breakoutRef }: ModalProps) => (
      <ImageModal
        isOpen={isOpen}
        onClose={onClose}
        image={image}
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
      render: (ticker: string) => (
        <NavButton href={`/tickers/${ticker}`}>{ticker}</NavButton>
      ),
    },
    {
      title: "Buy price",
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
      render: (item: BreakoutStoreType) => (
        <StyledImage
          onClick={() =>
            showImageModal({
              image: `${IMAGE_SERVICE_BASE_URL as string}/${item.image}`,
              breakoutRef: item.breakoutRef,
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
      render: (item: any) => <Rating breakoutRef={item.breakoutRef} />,
    },
    {
      title: "Operations",
      dataIndex: "",
      key: "operations",
      className: "operations",
      render: (item: BreakoutStoreType, row, index: number) => (
        <Operations>
          {!disableBuy && (
            <>
              <Button
                onClick={() => {
                  void showBreakoutModal({
                    image: `${IMAGE_SERVICE_BASE_URL as string}/${item.image}`,
                    breakoutRef: item.breakoutRef,
                    symbol: item.tickerRef,
                    breakoutValue: item.breakoutValue,
                    allBreakouts: data,
                    breakoutIndex: index,
                    showBreakoutModal,
                  });
                }}
              >
                Prepare Order
              </Button>
              <CancelOrderButton ticker={item.tickerRef} />
            </>
          )}
        </Operations>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={({ breakoutRef }: { breakoutRef: string }) => breakoutRef}
      title={renderTitle}
      footer={renderFooter}
    />
  );
};

export default BreakoutsList;
