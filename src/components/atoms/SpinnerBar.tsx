import { useEffect } from "react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";

const CenterDiv = styled.div`
  text-align: -webkit-center;
  transition: opacity 1s;
  opacity: ${({ opacity }: { opacity: number }) => opacity};
`;

interface Props {
  delay?: number;
}

export const SpinnerBar = ({ delay = 0 }: Props) => {
  const [opacity, setOpacity] = useState(delay > 0 ? 0 : 1);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (delay) {
      timeout = setTimeout(() => setOpacity(1), delay * 1000);
    }
    return () => clearTimeout(timeout);
  });

  return (
    <CenterDiv opacity={opacity}>
      <BarLoader color="#fff" />
    </CenterDiv>
  );
};
