import React from "react";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const InfoBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-top: 50px;
  width: 100%;
  height: 100%;

  border-radius: 20px;
  border: 1px solid white;
`;

const InfoBar = ({ children }: Props) => {
  return <InfoBarContainer>{children}</InfoBarContainer>;
};

export default InfoBar;
