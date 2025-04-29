import { createTheme } from "@mui/material/styles"

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0ea5e9", // sky-500
      light: "#38bdf8", // sky-400
      dark: "#0284c7", // sky-600
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b", // slate-500
      light: "#94a3b8", // slate-400
      dark: "#475569", // slate-600
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444", // red-500
    },
    warning: {
      main: "#f59e0b", // amber-500
    },
    info: {
      main: "#3b82f6", // blue-500
    },
    success: {
      main: "#10b981", // emerald-500
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
    divider: "#e2e8f0", // slate-200
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
})

// Create a dark theme
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    primary: {
      main: "#0ea5e9", // sky-500
      light: "#38bdf8", // sky-400
      dark: "#0284c7", // sky-600
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // slate-900
      paper: "#1e293b", // slate-800
    },
    text: {
      primary: "#f8fafc", // slate-50
      secondary: "#94a3b8", // slate-400
    },
    divider: "#334155", // slate-700
  },
})

export default theme
