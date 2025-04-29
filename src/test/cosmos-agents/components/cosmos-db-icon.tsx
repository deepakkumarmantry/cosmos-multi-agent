import Image from "next/image"
import { Box, type SxProps, type Theme } from "@mui/material"

interface CosmosDBIconProps {
  sx?: SxProps<Theme>
  size?: number
}

export function CosmosDBIcon({ sx, size = 24 }: CosmosDBIconProps) {
  return (
    <Box sx={sx}>
      <Image
        src="/images/cosmos-db-logo.png"
        alt="Azure Cosmos DB Logo"
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
    </Box>
  )
}
