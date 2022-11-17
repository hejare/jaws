import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";

type Props = {
  handleClick: () => void;
  children: ReactJSXElement;
};

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircularButton = ({ handleClick, children }: Props) => {
  return (
    <IconButton onClick={handleClick} aria-label="fingerprint">
      <Icon>{children}</Icon>
    </IconButton>
  );
};

export default CircularButton;
