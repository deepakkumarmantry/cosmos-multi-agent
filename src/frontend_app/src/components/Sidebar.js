import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  Typography, 
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  Tooltip,
  Switch,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FileDocumentIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTopicContext } from '../contexts/TopicContext';
import { useChatContext } from '../contexts/ChatContext';
import { useSettingsContext } from '../contexts/SettingsContext';

const drawerWidth = 280;
const collapsedWidth = 60;

function Sidebar({ mobileOpen, handleDrawerToggle, darkMode, toggleDarkMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { resetTopic } = useTopicContext();
  const { clearChat } = useChatContext();
  const { settings, toggleDebateDetails } = useSettingsContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleClearChat = () => {
    clearChat();
  };

  const handleGoToMainMenu = () => {
    clearChat();
    resetTopic();
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      bgcolor: darkMode ? '#1a1a1a' : '#f8f9fa',
      borderRight: '1px solid',
      borderColor: darkMode ? '#333' : '#e0e0e0',
      transition: 'all 0.3s ease'
    }}>
      <Box sx={{ 
        p: isCollapsed ? 1 : 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/cosmos-db-logo.png" 
              alt="Cosmos DB Logo" 
              style={{ 
                width: 28, 
                height: 28, 
                marginRight: '8px', 
                objectFit: 'contain' 
              }} 
            />
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: 600, 
                color: darkMode ? 'white' : 'inherit'
              }}
            >
              Azure Cosmos DB Support
            </Typography>
          </Box>
        )}
        
        {isCollapsed && (
          <Tooltip title="Azure Cosmos DB Support" placement="right">
            <Box sx={{ mx: 'auto', my: 1 }}>
              <img 
                src="/cosmos-db-logo.png" 
                alt="Cosmos DB Logo" 
                style={{ 
                  width: 32, 
                  height: 32, 
                  objectFit: 'contain' 
                }} 
              />
            </Box>
          </Tooltip>
        )}
        
        {(isMobile && !isCollapsed) && (
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: darkMode ? 'white' : 'inherit' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        
        {!isMobile && (
          <IconButton 
            onClick={handleToggleCollapse} 
            size="small" 
            sx={{ 
              color: darkMode ? 'white' : 'inherit',
              ...(isCollapsed && { mx: 'auto' })
            }}
          >
            {isCollapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
      
      {!isCollapsed && <Divider sx={{ mb: 2, bgcolor: darkMode ? '#333' : undefined }} />}
      
      {!isCollapsed && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5 
          }}>
            <Typography 
              variant="body2" 
              color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
              sx={{ 
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              Welcome
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            borderRadius: 1,
            p: 1,
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
            }
          }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: '#68768A' }}>
              DU
            </Avatar>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: darkMode ? 'white' : 'inherit'
                }}
              >
                Default User
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      {isCollapsed ? (
        <Box sx={{ mt: 2 }}>
          <List disablePadding>
            <Tooltip title="Home" placement="right">
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={handleGoToMainMenu}
                  sx={{ 
                    borderRadius: 1,
                    py: 1,
                    minHeight: 0,
                    mx: 'auto',
                    width: 40,
                    justifyContent: 'center'
                  }}
                >
                  <HomeIcon fontSize="small" sx={{ color: darkMode ? 'white' : '#68768A' }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            
            <Tooltip title="New Chat" placement="right">
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={handleClearChat}
                  sx={{ 
                    borderRadius: 1,
                    py: 1,
                    minHeight: 0,
                    mx: 'auto',
                    width: 40,
                    justifyContent: 'center'
                  }}
                >
                  <AddIcon fontSize="small" sx={{ color: darkMode ? 'white' : '#68768A' }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            
            <Tooltip title="Documentation" placement="right">
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component="a"
                  href="https://learn.microsoft.com/en-us/azure/cosmos-db/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    borderRadius: 1,
                    py: 1,
                    minHeight: 0,
                    mx: 'auto',
                    width: 40,
                    justifyContent: 'center'
                  }}
                >
                  <FileDocumentIcon fontSize="small" sx={{ color: darkMode ? 'white' : '#68768A' }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
            
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} placement="right">
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={toggleDarkMode}
                  sx={{ 
                    borderRadius: 1,
                    py: 1,
                    minHeight: 0,
                    mx: 'auto',
                    width: 40,
                    justifyContent: 'center'
                  }}
                >
                  {darkMode ? 
                    <LightModeIcon fontSize="small" sx={{ color: 'white' }} /> :
                    <DarkModeIcon fontSize="small" sx={{ color: '#68768A' }} />
                  }
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>
        </Box>
      ) : (
        <>
          <Box sx={{ px: 2, mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 1 
            }}>
              <Typography 
                variant="body2" 
                color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                sx={{ 
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Actions
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={handleGoToMainMenu}
              sx={{ 
                mb: 2, 
                textTransform: 'none',
                borderRadius: '4px',
                py: 0.75,
                bgcolor: darkMode ? '#333' : undefined,
                color: darkMode ? 'white' : undefined,
                '&:hover': {
                  bgcolor: darkMode ? '#444' : undefined
                }
              }}
            >
              Main Menu
            </Button>
            
            <Button
              variant="outlined"
              fullWidth
              startIcon={<DeleteSweepIcon />}
              onClick={handleClearChat}
              sx={{ 
                mb: 2, 
                textTransform: 'none',
                borderRadius: '4px',
                py: 0.75,
                borderColor: darkMode ? '#555' : undefined,
                color: darkMode ? 'white' : undefined
              }}
            >
              Clear Chat
            </Button>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ bgcolor: darkMode ? '#333' : undefined }} />
            <List disablePadding sx={{ p: 1 }}>
              <ListItem disablePadding>
                <ListItemButton 
                  component="a"
                  href="https://learn.microsoft.com/en-us/azure/cosmos-db/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    borderRadius: 1,
                    color: darkMode ? 'white' : 'inherit'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FileDocumentIcon fontSize="small" sx={{ color: darkMode ? 'white' : undefined }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Documentation" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={toggleDarkMode}
                  sx={{ 
                    borderRadius: 1,
                    color: darkMode ? 'white' : 'inherit' 
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {darkMode ? 
                      <LightModeIcon fontSize="small" sx={{ color: 'white' }} /> :
                      <DarkModeIcon fontSize="small" />
                    }
                  </ListItemIcon>
                  <ListItemText 
                    primary={darkMode ? "Light Mode" : "Dark Mode"} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={toggleDebateDetails}
                  sx={{ 
                    borderRadius: 1,
                    color: darkMode ? 'white' : 'inherit' 
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Switch
                      checked={settings.includeDebateDetails}
                      size="small"
                      sx={{ 
                        '& .MuiSwitch-thumb': {
                          backgroundColor: settings.includeDebateDetails ? theme.palette.primary.main : undefined
                        }
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Show Debate Details" 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondary={settings.includeDebateDetails ? "Enabled" : "Disabled"}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 3
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: isCollapsed ? collapsedWidth : drawerWidth,
            position: 'relative',
            height: '100%',
            border: 'none',
            transition: 'width 0.3s ease'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Sidebar;