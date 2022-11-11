import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import CircularButton from '../atoms/buttons/CircularButton';
import RectangularButton from "../atoms/buttons/RectangularButton"
import { handleBuyOrder } from "../../services/brokerService";

interface Props {
    isOpen: boolean;
    handleClose: () => void;
    ticker: string;
    price: number;
    name: string;
}

const ContentContainer = styled.div`
    display: flex;
`
const InfoContainer = styled.div`
    width: 50%;
`

const GraphContainer = styled.div`
    color: white;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 15px 0 15px 0;
    width: 50%;
` 
const Graph = styled.div`
    width: 50vh;
    height: 50vh;
    background-color: #3F433A;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
` 

const CancelButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
`

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ModalDialog({isOpen, handleClose, ticker, price, name}: Props) {

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <CancelButtonContainer>
                <CircularButton handleClick={handleClose}>
                    <>X</>
                </CircularButton>
            </CancelButtonContainer>
        <ContentContainer>       
            <InfoContainer>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Daily pick {ticker} {name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Price: {price}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Entry Date:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Symbol:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Chart at Entry:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Time:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Shares:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Entry Price:
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Size:
                </Typography>
                <RectangularButton handleClick={() => handleBuyOrder(ticker)} label={`BUY $1 ${name}`} variant="contained" size="small" color="info"/>
            </InfoContainer>
          <GraphContainer>
            <Graph>Graph</Graph>
          </GraphContainer>
        </ContentContainer>   
        </Box>
      </Modal>
    </div>
  );
}
