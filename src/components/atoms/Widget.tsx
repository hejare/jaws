import React from "react";
import styled from "styled-components";

const StyledWidget = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 155px;
  width: 155px;
  border-radius: 20px;
  background-color: grey;
  flex-direction: column;
`;

type Props = {
  children?: React.ReactNode;
};

const Widget = ({ children }: Props) => {
  return <StyledWidget>{children}</StyledWidget>;
};

export default Widget;
