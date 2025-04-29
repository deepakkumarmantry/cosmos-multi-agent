"use client"
import { Box, Paper, Typography, useTheme } from "@mui/material"
import { CosmosDBIcon } from "@/components/cosmos-db-icon"
import { motion } from "framer-motion"
import { LoadingAnimation } from "@/components/loading-animation"

interface StatusIndicatorProps {
  statusMessages: string[]
}

export function StatusIndicator({ statusMessages }: StatusIndicatorProps) {
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
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(to bottom right, #38bdf8, #0284c7)",
          color: "white",
          flexShrink: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)",
            "0 10px 15px -3px rgba(14, 165, 233, 0.2), 0 4px 6px -2px rgba(14, 165, 233, 0.1)",
            "0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <CosmosDBIcon size={16} />
      </motion.div>

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LoadingAnimation />
          <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ ml: 1.5 }}>
            Our Cosmos DB specialists are working on your request
          </Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, "& > li": { mb: 1 } }}>
          {statusMessages.map((message, index) => (
            <motion.li
              key={index}
              style={{ display: "flex", alignItems: "center", gap: theme.spacing(1) }}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(14, 165, 233, 0.2)" : "rgba(224, 242, 254, 1)",
                  color: theme.palette.primary.main,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? ["rgba(14, 165, 233, 0.2)", "rgba(14, 165, 233, 0.3)", "rgba(14, 165, 233, 0.2)"]
                      : ["rgba(224, 242, 254, 1)", "rgba(186, 230, 253, 1)", "rgba(224, 242, 254, 1)"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
              >
                •
              </motion.span>

              <motion.span
                style={{ color: theme.palette.text.secondary }}
                animate={{
                  color:
                    theme.palette.mode === "dark"
                      ? ["rgba(148, 163, 184, 1)", "rgba(14, 165, 233, 1)", "rgba(148, 163, 184, 1)"]
                      : ["rgba(51, 65, 85, 1)", "rgba(14, 165, 233, 1)", "rgba(51, 65, 85, 1)"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.3,
                }}
              >
                {message}
              </motion.span>
            </motion.li>
          ))}
        </Box>
      </Paper>
    </motion.div>
  )
}
