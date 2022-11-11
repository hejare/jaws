import { useState } from "react";
import styled from "styled-components";
import { handleBuyOrder, handleSellOrder } from "../../services/brokerService";
import RectangularButton from "../atoms/buttons/RectangularButton";
import ModalDialog from "./ModalDialog";

interface Props {
  ticker: string;
  price: number;
  name: string;
}

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 5px;
`;

const TickerCard = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div>
      <h2>
        {props.name} {props.price}
      </h2>
      <a
        href={`https://www.tradingview.com/symbols/${props.ticker}`}
        target="_blank"
      >
        {props.ticker}
      </a>
      <ButtonsContainer>
        <RectangularButton
          handleClick={handleOpen}
          variant="outlined"
          size="small"
          label="More info"
        />
        <RectangularButton
          label={`BUY $1 ${props.name}`}
          variant="contained"
          size="small"
          color="info"
          handleClick={() => handleBuyOrder(props.ticker)}
        />
        <RectangularButton
          label={`SELL $1 ${props.name}`}
          variant="contained"
          size="small"
          color="success"
          handleClick={() => handleSellOrder(props.ticker)}
        />
      </ButtonsContainer>
      <ModalDialog isOpen={isModalOpen} handleClose={handleClose} {...props} />
    </div>
  );
};

export default TickerCard;
