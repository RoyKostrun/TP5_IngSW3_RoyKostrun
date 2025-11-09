import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  ul {
    list-style: none;
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }
`;
