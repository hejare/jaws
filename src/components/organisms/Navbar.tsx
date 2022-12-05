import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { getToday } from "../../lib/helpers";
import { Theme } from "../../styles/themes";
import { useRouter } from "next/router";
import { User } from "../../store/accountStore";
import { signInWithGoogle } from "../../auth/firestoreAuth";
import Button from "../atoms/buttons/Button";
import { setCookies } from "cookies-next";
import { useStore } from "zustand";
import { AccountContext } from "../../store/accountContext";

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

const NavBarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.palette.actionHover.text};
    transform: scale(1.05);
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

  const store = useContext(AccountContext);
  if (!store) throw new Error("Missing AccountContext.Provider in the tree");
  const [isLoggedIn, setIsLoggedIn, setUser, logoutUser] = useStore(
    store,
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
        void router.push(router.pathname);
      })
      .catch((e) => console.error(e));
  };

  return (
    <NavBarContainer>
      <Link href={"/"}>
        <LogoContainer />
      </Link>
      <LinksContainer>
        <Link href={`/daily-runs/${today}`}>
          <NavBarItem
            active={
              pathName === "/daily-runs/[date]" ||
              pathName === "/daily-runs/[date]/[time]"
            }
          >
            Todays run
          </NavBarItem>
        </Link>
        <Link href="/daily-runs">
          <NavBarItem active={pathName === "/daily-runs"}>All runs</NavBarItem>
        </Link>
        <Link href="/orders">
          <NavBarItem active={pathName === "/orders"}>All orders</NavBarItem>
        </Link>
        <Link href="/portfolio">
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
