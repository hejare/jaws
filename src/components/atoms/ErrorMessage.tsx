import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const Container = styled.div`
  color: ${({ theme }) => theme.palette.text.error};
`;

const ErrorMessage = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default ErrorMessage;
