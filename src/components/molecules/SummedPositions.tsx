import { useEffect, useState } from "react";
import { sumPositions } from "../../lib/handlePositionsValue";
import TextDisplay from "../atoms/TextDisplay";

const SummedPositions = () => {
  const [positionsSum, setPositionsSum] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await sumPositions().then((data) => {
          setPositionsSum(data);
        });
      } catch (e) {
        console.log(e);
      }
    };
    void fetchData();
  }, []);

  return (
    <TextDisplay>
      <div>Positions value:</div>
      <div>${positionsSum}</div>
    </TextDisplay>
  );
};

export default SummedPositions;
