import React, { useState, useMemo } from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import ApiConfigManager from './components/ApiConfigManager';
import { TopicProvider } from './contexts/TopicContext';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Create a theme instance.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#0078D4', // Azure blue
            light: '#50B0F9',
            dark: '#106EBE',
          },
          secondary: {
            main: '#50E6FF', // Azure light blue
          },
          background: {
            default: darkMode ? '#121212' : '#f9f9f9',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: darkMode ? '#f5f5f5' : '#323130',
            secondary: darkMode ? '#b0b0b0' : '#605E5C',
          },
        },
        typography: {
          fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow: darkMode 
                  ? '0px 2px 8px rgba(0, 0, 0, 0.2)' 
                  : '0px 2px 8px rgba(0, 0, 0, 0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SettingsProvider>
        <TopicProvider>
          <ChatProvider>
          <Box sx={{ 
            display: 'flex', 
            height: '100vh',
            overflowX: 'hidden',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: 'all 0.3s ease'
          }}>
            <Sidebar 
              mobileOpen={mobileOpen} 
              handleDrawerToggle={handleDrawerToggle}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
            <MainChat 
              handleDrawerToggle={handleDrawerToggle}
              darkMode={darkMode}
            />
            {/* API Configuration Manager */}
            <ApiConfigManager />
          </Box>
        </ChatProvider>
      </TopicProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;