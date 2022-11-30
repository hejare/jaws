import fetch from "node-fetch";
import { convertResult } from "../util";

interface Position {
  current_price: string;
  qty: string;
}
/* TODO Once we have a state management system, 
use "all positions" stored there. Do not
request all positions from here. */
const getPositions = async () => {
  const result = await fetch(`/api/broker/account/assets`);
  const data = await convertResult(result);
  return data.assets;
};

export const sumPositions = async () => {
  const positions = await getPositions();
  let positionsSum = 0;

  positions.forEach((position: Position) => {
    const sum = parseFloat(position.current_price) * parseFloat(position.qty);
    positionsSum += sum;
  });

  return positionsSum.toFixed(4);
};
