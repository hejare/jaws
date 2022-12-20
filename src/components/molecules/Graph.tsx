import React from "react";
import getNextJSConfig from "next/config";
import styled from "styled-components";
import { TradeViewWidget } from "../atoms/TradeViewWidget";

const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  border: 5px solid green;
  background-color: white;
`;

const StyledImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ImageContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

type Props = {
  _ref: string;
  tickerRef: string;
  breakoutValue: number;
  image: string;
};

const { publicRuntimeConfig } = getNextJSConfig();
const { IMAGE_SERVICE_BASE_URL = "[NOT_DEFINED_IN_ENV]" } = publicRuntimeConfig;

const Graph = ({ image, _ref, tickerRef, breakoutValue }: Props) => {
  const imageUrl = `${IMAGE_SERVICE_BASE_URL as string}/${image}`;

  return (
    <StyledContainer>
      <button>Switch to tradeview radio button</button>
      <ImageContainer>
        <StyledImg src={imageUrl} />
        <TradeViewWidget ticker={tickerRef} />
      </ImageContainer>
      <p>breakoutRef: {_ref}</p>
      <p>symbol: {tickerRef}</p>
      <p>breakoutValue: {breakoutValue}</p>
    </StyledContainer>
  );
};

export default Graph;
