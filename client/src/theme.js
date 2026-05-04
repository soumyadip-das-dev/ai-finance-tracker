import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3b82f6" },
    background: { default: "#0f172a", paper: "#1e293b" },
  },
  shape: { borderRadius: 12 },
});

export default theme;