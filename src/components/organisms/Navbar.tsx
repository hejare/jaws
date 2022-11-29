import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { getToday } from "../../lib/helpers";
import { Theme } from "../../styles/themes";
import { useRouter } from "next/router";

const NavBarContainer = styled.div`
  display: flex;
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

const Navbar = () => {
  const today = getToday();
  const router = useRouter();
  const [pathName, setPathName] = useState("");

  useEffect(() => {
    setPathName(router.pathname);
  }, [router]);

  console.log(router.pathname);

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
        <Link href="/assets">
          <NavBarItem active={pathName === "/assets"}>Own assets</NavBarItem>
        </Link>
        <Link href="/orders">
          <NavBarItem active={pathName === "/orders"}>All orders</NavBarItem>
        </Link>
      </LinksContainer>
    </NavBarContainer>
  );
};

export default Navbar;
