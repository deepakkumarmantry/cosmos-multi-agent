"use client"
import { Box, Paper, useTheme } from "@mui/material"
import { CosmosDBIcon } from "@/components/cosmos-db-icon"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"

interface AssistantMessageProps {
  content: string
}

export function AssistantMessage({ content }: AssistantMessageProps) {
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
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(to bottom right, #38bdf8, #0284c7)",
          color: "white",
          flexShrink: 0,
          boxShadow:
            theme.palette.mode === "dark" ? "0 4px 8px rgba(14, 165, 233, 0.2)" : "0 4px 8px rgba(14, 165, 233, 0.1)",
        }}
      >
        <CosmosDBIcon size={16} />
      </Box>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          "& .markdown": {
            "& h2": {
              fontSize: "1.25rem",
              fontWeight: 600,
              marginTop: 2,
              marginBottom: 1,
              paddingBottom: 0.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.primary,
            },
            "& h3": {
              fontSize: "1.125rem",
              fontWeight: 600,
              marginTop: 1.5,
              marginBottom: 0.75,
              color: theme.palette.text.primary,
            },
            "& p": {
              marginBottom: 1,
              color: theme.palette.text.secondary,
            },
            "& ul": {
              paddingLeft: 2.5,
              marginBottom: 1,
            },
            "& li": {
              marginBottom: 0.5,
              color: theme.palette.text.secondary,
            },
            "& strong": {
              fontWeight: 600,
              color: theme.palette.text.primary,
            },
          },
        }}
      >
        <Box className="markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Paper>
    </motion.div>
  )
}
