import {useState} from "react"
import styled from 'styled-components';
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
`

const TickerCard = ({ price, name, ticker }: Props) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const tickerInfo = {price, name, ticker}

  return (
    <div>
      <h2>
        {name} {price}
      </h2>
      <a href={`https://www.tradingview.com/symbols/${ticker}`} target="_blank">
        {ticker}
      </a>
      <ButtonsContainer>
        <RectangularButton handleClick={handleOpen} variant="outlined" size="small" label="More info"/>
        <RectangularButton label={`BUY $1 ${name}`} variant="contained" size="small" color="info" handleClick={() => handleBuyOrder(ticker)}/>
        <RectangularButton label={`SELL $1 ${name}`} variant="contained" size="small" color="success" handleClick={() => handleSellOrder(ticker)}/>
      </ButtonsContainer>
      <ModalDialog isOpen={isModalOpen} handleClose={handleClose} {...tickerInfo}/>
    </div>
  );
};

export default TickerCard;
