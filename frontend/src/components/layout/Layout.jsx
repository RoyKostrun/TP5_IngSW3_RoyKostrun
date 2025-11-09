import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;
