import { useEffect, useState } from "react";
import { sumPositions } from "../../lib/handlePositionsValue";
import TextDisplay from "../atoms/TextDisplay";

const SummedPositions = () => {
  const [positionsSum, setPositionsSum] = useState<string>();

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
      <div>Portfolio value</div>
      <div>${positionsSum}</div>
    </TextDisplay>
  );
};

export default SummedPositions;
