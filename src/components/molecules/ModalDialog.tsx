import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { flexbox } from '@mui/system';

interface Props {
    isOpen: boolean;
    handleClose: () => void;
    ticker: string;
    price: number;
    name: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
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
        </Box>
      </Modal>
    </div>
  );
}