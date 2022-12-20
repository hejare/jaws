import React from "react";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const InfoBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: lightblue;
  border-radius: 20px;
  color: black;
`;

const InfoBar = ({ children }: Props) => {
  return <InfoBarContainer>{children}</InfoBarContainer>;
};

export default InfoBar;
