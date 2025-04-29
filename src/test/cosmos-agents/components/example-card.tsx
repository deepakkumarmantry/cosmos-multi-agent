"use client"
import { Card, CardHeader, CardContent, Typography, Box, useTheme } from "@mui/material"
import { motion } from "framer-motion"
import type { SvgIconComponent } from "@mui/icons-material"

interface ExampleCardProps {
  title: string
  icon: SvgIconComponent
  color: string
  example: string
  onSelect: (example: string) => void
}

export function ExampleCard({ title, icon: Icon, color, example, onSelect }: ExampleCardProps) {
  const theme = useTheme()

  return (
    <motion.div
      whileHover={{
        y: -3,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%", width: "100%" }}
    >
      <Card
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          cursor: "pointer",
          borderRadius: 2,
        }}
        onClick={() => onSelect(example.replace("\n", " "))}
      >
        <CardHeader
          sx={{
            py: 1.5,
            px: 2,
            background: color,
            color: "white",
          }}
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Icon sx={{ fontSize: 16 }} />
              <Typography variant="subtitle2" fontWeight={500} noWrap>
                {title}
              </Typography>
            </Box>
          }
          disableTypography
        />
        <CardContent
          sx={{
            pt: 1.5,
            pb: 1.5,
            px: 2,
            backgroundColor: theme.palette.background.paper,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            height: 70, // Fixed height for 2 lines
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              width: "100%",
              lineHeight: 1.5, // Consistent line height
              fontSize: "0.75rem", // Consistent font size
              height: "2.25rem", // Force exact 2-line height (1.5 × 0.75rem × 2)
              whiteSpace: "pre-line", // Respect newline characters
            }}
          >
            {example}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}
