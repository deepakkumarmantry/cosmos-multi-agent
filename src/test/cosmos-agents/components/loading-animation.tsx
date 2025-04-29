"use client"
import { Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"

export function LoadingAnimation() {
  const theme = useTheme()
  const colors = [theme.palette.primary.light, theme.palette.primary.main, theme.palette.primary.dark]

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: colors[index],
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
            y: [0, -5, 0],
            boxShadow: [
              "0 0 0 rgba(14, 165, 233, 0)",
              "0 0 10px rgba(14, 165, 233, 0.5)",
              "0 0 0 rgba(14, 165, 233, 0)",
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      ))}
    </Box>
  )
}
