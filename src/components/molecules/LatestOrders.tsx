import { useEffect, useState } from "react";
import styled from "styled-components";
import { getLatestOrders } from "../../lib/handleLatestOrders";
import TextDisplay from "../atoms/TextDisplay";

interface Order {
  symbol: string;
  qty: string;
}

const FlexContainer = styled.div`
  display: flex;
  gap: 3px;
`;

const LatestOrders = () => {
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLatestOrders().then((data) => {
          setOrders(data);
        });
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay>
      <div>Latest orders</div>
      {orders?.map((order, i) => (
        <FlexContainer key={i}>
          <div>{order.symbol}</div>
          <div>{`(Qty ${order.qty})`}</div>
        </FlexContainer>
      ))}
    </TextDisplay>
  );
};

export default LatestOrders;
