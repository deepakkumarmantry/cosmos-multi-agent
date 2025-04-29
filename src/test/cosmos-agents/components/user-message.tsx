"use client"
import { Box, Paper, useTheme } from "@mui/material"
import { PersonOutline } from "@mui/icons-material"
import { motion } from "framer-motion"

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  const theme = useTheme()

  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: theme.spacing(1.5),
        padding: theme.spacing(0, 1),
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(to bottom right, #a855f7, #6366f1)",
          color: "white",
          flexShrink: 0,
          boxShadow:
            theme.palette.mode === "dark" ? "0 4px 8px rgba(99, 102, 241, 0.2)" : "0 4px 8px rgba(99, 102, 241, 0.1)",
        }}
      >
        <PersonOutline sx={{ fontSize: 16 }} />
      </Box>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        {content}
      </Paper>
    </motion.div>
  )
}
