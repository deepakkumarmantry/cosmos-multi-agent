"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
} from "@mui/material"
import {
  Message as MessageIcon,
  MenuBook as MenuBookIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpOutlineIcon,
  Circle as CircleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  History as HistoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { CosmosDBIcon } from "@/components/cosmos-db-icon"
import { formatDistanceToNow } from "date-fns"

// Define the ChatSession type
export type ChatSession = {
  id: string
  title: string
  timestamp: Date
  preview: string
  messages: Array<{ role: "user" | "assistant"; content: string }>
}

interface SidebarProps {
  onNewChat: () => void
  chatHistory: ChatSession[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export function Sidebar({ onNewChat, chatHistory, currentChatId, onSelectChat, onDeleteChat }: SidebarProps) {
  const [userName, setUserName] = useState("Default User")
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [isExpanded, setIsExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const expandedWidth = 280
  const collapsedWidth = 72
  const drawerWidth = isExpanded ? expandedWidth : collapsedWidth

  useEffect(() => {
    // In a real app, this would fetch the user's name from an auth provider
    setUserName("Default User")
  }, [])

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded)
  }

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <motion.div
      initial={{ x: 0, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <Box
        sx={{
          p: isExpanded ? 3 : 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "space-between" : "center",
        }}
      >
        {isExpanded ? (
          <>
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" noWrap>
                Welcome
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {userName}
              </Typography>
            </Box>
            <IconButton onClick={toggleDrawer} size="small">
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={toggleDrawer} size="small">
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ my: isExpanded ? 2 : 1 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: isExpanded ? "flex-start" : "center",
          justifyContent: "space-between",
          mb: 1,
          px: isExpanded ? 3 : 1.5,
        }}
      >
        {isExpanded ? (
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MessageIcon fontSize="small" sx={{ mr: 1 }} />
              Chats
            </Box>
          </Typography>
        ) : (
          <MessageIcon fontSize="small" color="primary" />
        )}

        <Tooltip title="New Chat">
          <IconButton
            onClick={onNewChat}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <List
        sx={{
          maxHeight: "30vh",
          overflow: "auto",
          px: isExpanded ? 2 : 0.5,
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.divider,
            borderRadius: "4px",
          },
        }}
      >
        <ListItem disablePadding>
          <ListItemButton
            onClick={onNewChat}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
              justifyContent: isExpanded ? "flex-start" : "center",
              px: isExpanded ? 2 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: isExpanded ? 36 : 0, color: "inherit" }}>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="New Chat" />}
          </ListItemButton>
        </ListItem>

        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              secondaryAction={
                isExpanded ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    sx={{
                      opacity: 0,
                      transition: "opacity 0.2s",
                      ".MuiListItemButton-root:hover &": {
                        opacity: 0.7,
                      },
                      "&:hover": {
                        opacity: 1,
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ) : null
              }
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                selected={currentChatId === chat.id}
                onClick={() => onSelectChat(chat.id)}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: isExpanded ? 2 : 1,
                  justifyContent: isExpanded ? "flex-start" : "center",
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "rgba(14, 165, 233, 0.25)" : "rgba(14, 165, 233, 0.2)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: isExpanded ? 36 : 0 }}>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={currentChatId !== chat.id}
                    sx={{ "& .MuiBadge-badge": { right: 3, top: 3 } }}
                  >
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "0.75rem",
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {chat.title.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText
                    primary={truncateText(chat.title, 20)}
                    secondary={
                      <Box component="span" sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                          {truncateText(chat.preview, 15)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                          {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: currentChatId === chat.id ? 600 : 400,
                      color: "text.primary",
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 2, textAlign: "center", display: isExpanded ? "block" : "none" }}>
            <HistoryIcon sx={{ color: theme.palette.text.disabled, mb: 1, fontSize: "2rem" }} />
            <Typography variant="body2" color="text.disabled">
              No chat history yet
            </Typography>
          </Box>
        )}
      </List>

      <Divider sx={{ my: isExpanded ? 2 : 1 }} />

      <List disablePadding sx={{ px: isExpanded ? 2 : 0.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://learn.microsoft.com/en-us/azure/cosmos-db/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
              px: isExpanded ? 2 : 1,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: isExpanded ? 36 : 0 }}>
              <MenuBookIcon fontSize="small" />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Documentation" />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: isExpanded ? "flex-start" : "center",
              px: isExpanded ? 2 : 1,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <ListItemIcon sx={{ minWidth: isExpanded ? 36 : 0 }}>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Settings" />}
          </ListItemButton>
        </ListItem>
      </List>

      {isExpanded && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ px: 3, overflow: "auto", flex: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              About
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              This chat interface connects you with specialized Azure Cosmos DB agents that can help with:
            </Typography>

            <List dense disablePadding sx={{ ml: 1 }}>
              {[
                "Evaluating if Cosmos DB fits your use case",
                "Designing optimal data models and schemas",
                "Understanding pricing and cost optimization",
                "Planning integration with other Azure services",
              ].map((text, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <CircleIcon sx={{ fontSize: 8, color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mt: 2 }}>
              Ask a specific question to get started!
            </Typography>
          </Box>
        </>
      )}

      <Box
        sx={{
          mt: "auto",
          p: isExpanded ? 2 : 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "flex-start" : "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(to right, #38bdf8, #0284c7)",
          }}
        >
          <CosmosDBIcon size={16} />
        </Box>
        {isExpanded && (
          <Box sx={{ ml: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Powered by
            </Typography>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              Azure Cosmos DB
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  )

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMobileDrawerToggle}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1100,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            "&:hover": {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: expandedWidth,
              border: "none",
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    )
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      {drawer}
    </Drawer>
  )
}
