import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { handleDeleteOrder, handleGetTrades } from "../../services/brokerService";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export type OrderType = 'buy' | 'sell';

const cancellableOrderStatus = ['new', 'partially_filled', 'done_for_day', 'accepted', 'pending_new', 'accepted_for_bidding'] as const;
type CancellableOrderStatus = (typeof cancellableOrderStatus)[number]
const nonCancellableOrderStatus = ['filled', 'canceled', 'expired', 'replaced', 'pending_cancel', 'pending_replace', 'stopped', 'rejected', 'suspended', 'calculated'] as const;
type NonCancellableOrderStatus = (typeof nonCancellableOrderStatus)[number]
export type OrderStatus = CancellableOrderStatus | NonCancellableOrderStatus;

export interface Order {
  symbol: string;
  id: string;
  status: OrderStatus;
  notional: string;
  created_at: string;
  filled_at?: string;
  side: OrderType;
}

const OrderList = () => {
  const [orders, setOrders] = useState(Array<Order>);

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleGetTrades();
      setOrders(data);
    };

    fetchData();
  }, []);

  const convertDateString = (date: string) => {
    const createdAtConvertedArray = date.split("T");
    return createdAtConvertedArray[0];
  };

return (
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>Symbol</TableCell>
        <TableCell align="right">Created at</TableCell>
        <TableCell align="right">Filled at</TableCell>
        <TableCell align="right">Notional</TableCell>
        <TableCell align="right">Status</TableCell>
        <TableCell align="right">Delete</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {orders.map((row: any, idx) => (
        <TableRow key={idx}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row" >{row.symbol}</TableCell>
          <TableCell  align="right">{convertDateString(row.created_at)}</TableCell>
          <TableCell align="right">{row.filled_at ? convertDateString(row.filled_at) : ""}</TableCell>
          <TableCell align="right">{row.notional}</TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="right">
            <Button variant="contained" size="small" disabled={(nonCancellableOrderStatus as unknown as string[]).includes(row.status)} onClick={() => handleDeleteOrder(row.id)}>Delete Order</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>)}


export default OrderList;
