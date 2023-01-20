import { useEffect, useState } from "react";
import { sumPositions } from "@jaws/lib/handlePositionsValue";
import { BoldText } from "../atoms/BoldText";
import TextDisplay from "../atoms/TextDisplay";

const SummedPositions = () => {
  const [positionsSum, setPositionsSum] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sumPositions();
        setPositionsSum(data);
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay>
      <BoldText>Portfolio value</BoldText>
      <div>${positionsSum.toFixed()}</div>
    </TextDisplay>
  );
};

export default SummedPositions;
