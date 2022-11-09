import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import CircularButton from '../atoms/buttons/CircularButton';
import Button from '@mui/material/Button';
import { handleBuyOrder } from "../../services/brokerService";

interface Props {
    isOpen: boolean;
    handleClose: () => void;
    ticker: string;
    price: number;
    name: string;
}

const GraphContainer = styled.div`
    color: white;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 15px 0 15px 0;
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

const ButtonContainer = styled.div`
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
            <ButtonContainer>
                <CircularButton handleClick={handleClose}>
                    <>X</>
                </CircularButton>
            </ButtonContainer>
        <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Daily pick {ticker} {name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Price {price}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Nyckeltal 2
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Nyckeltal 3, ..., Nyckeltal n
            </Typography>
        </div>
          <GraphContainer>
            <Graph>Graph</Graph>
          </GraphContainer>
          <Button variant="contained" size="small" color="info" onClick={() => handleBuyOrder(ticker)}>BUY $1 {name}</Button>
        </Box>
      </Modal>
    </div>
  );
}