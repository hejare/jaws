import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { getToday } from "../../lib/helpers";

const NavBarContainer = styled.div`
  display: flex;
  height: 50px;
  width: 100%;
  gap: 10px;
  padding: 15px;
`;

const NavBarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.palette.actionHover.text};
  }
`;

const Navbar = () => {
  const today = getToday();
  return (
    <NavBarContainer>
      <Link href={`/daily-runs/${today}`}>
        <NavBarItem>Todays run</NavBarItem>
      </Link>
      <Link href="/daily-runs">
        <NavBarItem>All runs</NavBarItem>
      </Link>
      <Link href="/assets">
        <NavBarItem>Own assets</NavBarItem>
      </Link>
      <Link href="/orders">
        <NavBarItem>All orders</NavBarItem>
      </Link>
    </NavBarContainer>
  );
};

export default Navbar;
