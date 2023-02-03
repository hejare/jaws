import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Button from "./Button";

interface Props {
  children: React.ReactNode;
  href: string;
  goBack?: boolean;
  className?: string;
  disabled?: boolean;
}

const StyledButton = styled(Button)`
  width: fit-content;
`;
const NavButton = ({ children, href, goBack, className, disabled }: Props) => {
  const router = useRouter();

  if (goBack) {
    return (
      <span onClick={() => router.back()} className={className}>
        <StyledButton>{children}</StyledButton>
      </span>
    );
  }
  if (disabled) {
    return (
      <span className={className}>
        <StyledButton disabled>{children}</StyledButton>
      </span>
    );
  }
  return (
    <Link href={href}>
      <span className={className}>
        <Button>{children}</Button>
      </span>
    </Link>
  );
};
export default NavButton;
