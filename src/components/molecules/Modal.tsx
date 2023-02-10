import * as React from "react";
import styled from "styled-components";
import { useLockedBody, useOnClickOutside } from "usehooks-ts";
import Button from "../atoms/buttons/Button";

const ContentContainer = styled.div`
  display: flex;
  height: 100%;
`;

const CancelButtonContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  top: -24px;
`;

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  box-shadow: 24;
  padding: 16px;
`;

const ModalContent = styled.div`
  display: flex;
  position: fixed;
  background-color: ${({ theme }) => theme.palette.background.backdrop};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const CircularButton = styled(Button)`
  border-radius: 50%;
  display: inline-block;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: string;
  enableOnClickOutside?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  enableOnClickOutside,
}: Props) {
  const ref = React.useRef(null);
  const [locked, setLocked] = useLockedBody(false, "root");

  const handleClose = () => {
    onClose();
  };

  React.useEffect(() => {
    setLocked(isOpen);
  }, [isOpen]);

  useOnClickOutside(ref, handleClose);

  return isOpen ? (
    <ModalContent
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box ref={enableOnClickOutside ? ref : null}>
        <CancelButtonContainer>
          <CircularButton onClick={handleClose}>
            <>X</>
          </CircularButton>
        </CancelButtonContainer>
        <ContentContainer>{children}</ContentContainer>
      </Box>
    </ModalContent>
  ) : (
    <></>
  );
}
