import React, { useState } from "react";
import getNextJSConfig from "next/config";
import styled from "styled-components";
import { TradeViewWidget } from "../atoms/TradeViewWidget";
import ToggleButton from "../atoms/buttons/ToggleButton";

// TODO rename to JawsTradeViewGraph or smh

const StyledContainer = styled.div`
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 900px;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  :hover {
    border: 1px solid ${({ theme }) => theme.palette.actionHover.border};
  }
`;

const ImageContainer = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 70%;
`;
const IframeContainer = styled.div`
  width: -webkit-fill-available;
  height: 70%;
`;

type Props = {
  _ref: string;
  tickerRef: string;
  breakoutValue: number;
  image: string;
};

const { publicRuntimeConfig } = getNextJSConfig();
const { IMAGE_SERVICE_BASE_URL = "[NOT_DEFINED_IN_ENV]" } = publicRuntimeConfig;

const JawsTradeViewGraph = ({
  image,
  _ref,
  tickerRef,
  breakoutValue,
}: Props) => {
  const imageUrl = `${IMAGE_SERVICE_BASE_URL as string}/${image}`;
  const [showTradeView, setShowTradeView] = useState(false);

  return (
    <ContentContainer>
      <StyledContainer>
        <ToggleButton
          leftButtonOnClick={() => setShowTradeView(false)}
          rightButtonOnClick={() => setShowTradeView(true)}
          rightText={"TradeView"}
          leftText={"Jaws"}
        />
        {!showTradeView ? (
          <ImageContainer>
            <StyledImage src={imageUrl} />
          </ImageContainer>
        ) : (
          <IframeContainer>
            <TradeViewWidget ticker={tickerRef} />
          </IframeContainer>
        )}
        <p>breakoutRef: {_ref}</p>
        <p>symbol: {tickerRef}</p>
        <p>breakoutValue: {breakoutValue}</p>
      </StyledContainer>
    </ContentContainer>
  );
};

export default JawsTradeViewGraph;
