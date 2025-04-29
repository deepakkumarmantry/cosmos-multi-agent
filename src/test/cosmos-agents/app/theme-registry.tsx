"use client"
import { useState } from "react"
import type React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme, { darkTheme } from "./theme"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"

// This implementation is from the Material UI Next.js example
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
        <CssBaseline />
        {/* Pass the theme toggle function to children */}
        {typeof children === "function" ? children({ toggleTheme, isDarkMode }) : children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
