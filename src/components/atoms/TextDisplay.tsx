import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextDisplay = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default TextDisplay;
