import { signInWithGoogle } from "@jaws/auth/firestoreAuth";
import { getToday } from "@jaws/lib/helpers";
import { useAccountStore } from "@jaws/store/account/accountContext";
import { User } from "@jaws/store/account/accountStore";
import { Theme } from "@jaws/styles/themes";
import { setCookies } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Button from "../atoms/buttons/Button";

const NavBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  gap: 15px;
  border-bottom: ${({ theme }: { theme: Theme }) =>
    `${theme.borders.base} ${theme.palette.border.primary}`};
  padding: 5px;
`;

const LogoContainer = styled.div`
  width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/static/shark.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  :hover {
    transform: scale(1.05);
  }
`;

const LinksContainer = styled.div`
  display: flex;
  height: 100%;
  gap: 15px;
`;

const NavBarItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.palette.actionHover.text};
    transform: scale(1.05);
    text-decoration: none;
  }
  ${({ active }: { active: boolean }) =>
    active &&
    css`
      color: #71b16b;
    `};
`;

const RightSide = styled.div`
  width: 100px;
`;

const Navbar = () => {
  const today = getToday();
  const router = useRouter();
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    setPathName(router.pathname);
  }, [router]);

  const [isLoggedIn, setIsLoggedIn, setUser, logoutUser] = useAccountStore(
    (state) => [
      state.isLoggedIn,
      state.setIsLoggedIn,
      state.setUser,
      state.logoutUser,
    ],
  );

  const handleLogin = () => {
    signInWithGoogle()
      .then((user: User) => {
        setCookies("idToken", user.idToken);
        setIsLoggedIn(true);
        setUser(user);
        location.reload();
      })
      .catch((e) => console.error(e));
  };

  return (
    <NavBarContainer>
      <Link href={"/"}>
        <LogoContainer />
      </Link>
      <LinksContainer>
        <Link href={`/`} passHref>
          <NavBarItem active={pathName === "/"}>Dashboard</NavBarItem>
        </Link>
        <Link href={`/daily-runs/${today}`} passHref>
          <NavBarItem active={pathName.startsWith("/daily-runs")}>
            Todays run
          </NavBarItem>
        </Link>
        <Link href="/orders" passHref>
          <NavBarItem active={pathName === "/orders"}>All orders</NavBarItem>
        </Link>
        <Link href="/portfolio" passHref>
          <NavBarItem active={pathName === "/portfolio"}>Portfolio</NavBarItem>
        </Link>
      </LinksContainer>

      <RightSide>
        {isLoggedIn ? (
          <Button onClick={logoutUser}>Log out</Button>
        ) : (
          <Button onClick={handleLogin}>Log in</Button>
        )}
      </RightSide>
    </NavBarContainer>
  );
};

export default Navbar;
