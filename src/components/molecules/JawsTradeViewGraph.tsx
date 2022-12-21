import React, { memo, useState } from "react";
import getNextJSConfig from "next/config";
import styled from "styled-components";
import { TradeViewWidget } from "../atoms/TradeViewWidget";
import ToggleButton from "../atoms/buttons/ToggleButton";
import { useModal } from "use-modal-hook";
import ImageModal from "./ImageModal";

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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  const [enableOnClickOutside, setEnableOnClickOutside] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const TheImageModal = memo(
    ({ isOpen: imageModalIsOpen, onClose: imageModalOnClose }: ModalProps) => (
      <ImageModal
        isOpen={imageModalIsOpen}
        onClose={() => {
          setEnableOnClickOutside(true);
          imageModalOnClose();
        }}
        image={imageUrl}
        enableOnClickOutside
        breakoutRef={_ref}
      />
    ),
  );
  const [showModal] = useModal(TheImageModal, {});

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
            <StyledImage
              onClick={() => {
                setEnableOnClickOutside(false);
                showModal({});
              }}
              onError={() => {
                setErrorMessage(
                  "Graph not accessible - will not be able to view Sharkster generated image",
                );
                setShowTradeView(true);
              }}
              src={imageUrl}
            />
          </ImageContainer>
        ) : (
          <IframeContainer>
            <TradeViewWidget ticker={tickerRef} />
          </IframeContainer>
        )}
      </StyledContainer>
    </ContentContainer>
  );
};

export default JawsTradeViewGraph;
