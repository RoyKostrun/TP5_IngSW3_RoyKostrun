import Home from "./pages/Home/Home";
import { ThemeProvider } from "styled-components";
import { theme } from "./components/styled/theme";
import { GlobalStyles } from "./components/styled/GlobalStyles";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Home />
    </ThemeProvider>
  );
}
