import styled from "styled-components";
import { Theme } from "../../styles/themes";

const EnabledDiv = styled.div`
  padding: 4px;
  text-align: center;
  border: ${({ theme }: { theme: Theme }) =>
    `${theme.borders.base} ${theme.palette.border.primary}`};
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-color: ${({ theme }) => theme.palette.background.primary};
`;

interface Props {
  onChange: (e: any) => void;
  value: string;
  title?: string;
  type?: string;
  step?: string;
}

const Input = ({
  onChange,
  value,
  title,
  type = "text",
  step = "1",
}: Props) => {
  return (
    <EnabledDiv>
      <label>{title}</label>
      <input onChange={onChange} value={value} type={type} step={step} />
    </EnabledDiv>
  );
};
export default Input;
