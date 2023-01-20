import { useEffect, useState } from "react";
import styled from "styled-components";
import { getLatestOrders } from "@jaws/lib/handleLatestOrders";
import { BoldText } from "../atoms/BoldText";
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
        const data = await getLatestOrders();
        setOrders(data);
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay>
      <BoldText>Latest orders</BoldText>
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
