import Link from "next/link";
import styled from "styled-components";
import Button from "./Button";

interface Props {
  children: React.ReactNode;
  href: string;
}

const StyledButton = styled(Button)``;
const NavButton = ({ children, href }: Props) => {
  return (
    <Link href={href}>
      <span>
        <StyledButton>{children}</StyledButton>
      </span>
    </Link>
  );
};
export default NavButton;
