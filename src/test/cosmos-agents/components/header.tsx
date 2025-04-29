"use client"
import { AppBar, Toolbar, Box, Typography, IconButton, Avatar, useTheme } from "@mui/material"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { CosmosDBIcon } from "@/components/cosmos-db-icon"

interface HeaderProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

export function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const theme = useTheme()

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ height: 64, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              background: "linear-gradient(to right, #38bdf8, #0284c7)",
              color: "white",
            }}
          >
            <CosmosDBIcon size={20} />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Azure Cosmos DB Support
          </Typography>
        </Box>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: "linear-gradient(to bottom right, #38bdf8, #0284c7)",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            DU
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
