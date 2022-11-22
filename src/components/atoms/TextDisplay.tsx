import styled from "styled-components";

type Props = {
  content: string[];
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextDisplay = ({ content }: Props) => {
  return (
    <Container>
      {content.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </Container>
  );
};

export default TextDisplay;
