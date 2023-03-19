import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const WidgetGrid = ({ children }: { children: React.ReactNode }) => (
  <GridContainer>{children}</GridContainer>
);

export default WidgetGrid;
