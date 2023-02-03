import styled from "styled-components";
import { SpinnerBar } from "../SpinnerBar";
import { Theme } from "@jaws/styles/themes";

const EnabledDiv = styled.div`
  padding: 4px;
  text-align: center;
  border: ${({ theme }: { theme: Theme }) =>
    `${theme.borders.base} ${theme.palette.border.primary}`};
  cursor: pointer;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-color: ${({ theme }) => theme.palette.background.primary};

  ::after {
    content: "";
    position: inherit;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  :hover {
    background-color: ${({ theme }) => theme.palette.background.hover};
    color: ${({ theme }) => theme.palette.text.hover};
    transform: scale(1.05, 1.05);
  }
  :hover ::after {
    opacity: 1;
  }
  :active {
    background-color: ${({ theme }) => theme.palette.background.active};
    color: ${({ theme }) => theme.palette.text.active};
  }
`;

const LoadingDiv = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

const DisabledDiv = styled.div`
  padding: 4px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.palette.border.disabled};
  cursor: not-allowed;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 5px;

  background-color: ${({ theme }) => theme.palette.background.disabled};
  color: ${({ theme }) => theme.palette.text.disabled};
`;

interface Props {
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
}

const Button = ({ children, loading, disabled, ...props }: Props) => {
  if (loading) {
    return (
      <LoadingDiv {...props}>
        <SpinnerBar />
      </LoadingDiv>
    );
  }
  if (disabled) {
    return <DisabledDiv {...props}>{children}</DisabledDiv>;
  }
  return <EnabledDiv {...props}>{children}</EnabledDiv>;
};
export default Button;
