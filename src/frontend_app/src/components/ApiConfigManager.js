import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { API_BASE_URL } from '../config/api';
import { setApiConfig } from '../utils/apiClient';

/**
 * API Configuration Manager Component
 * 
 * Provides a UI for updating API endpoint configuration
 */
function ApiConfigManager() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(() => {
    // Parse the current API URL to pre-populate fields
    try {
      const url = new URL(API_BASE_URL);
      return {
        protocol: url.protocol.replace(':', ''),
        host: url.hostname,
        port: url.port,
        basePath: url.pathname,
      };
    } catch (e) {
      // Default values if parsing fails
      return {
        protocol: 'http',
        host: 'localhost',
        port: '3000',
        basePath: '/api',
      };
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setApiConfig(config);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleOpen}
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            opacity: 0.9
          }
        }}
      >
        <SettingsIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>API Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Configure the API endpoint settings. The application will reload after saving.
            </Alert>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Current API URL: <code>{API_BASE_URL}</code>
            </Typography>
            
            <TextField
              fullWidth
              label="Protocol"
              name="protocol"
              value={config.protocol}
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              margin="normal"
            >
              <option value="http">http</option>
              <option value="https">https</option>
            </TextField>
            
            <TextField
              fullWidth
              label="Host"
              name="host"
              value={config.host}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., localhost or api.example.com"
            />
            
            <TextField
              fullWidth
              label="Port"
              name="port"
              value={config.port}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., 3000"
            />
            
            <TextField
              fullWidth
              label="Base Path"
              name="basePath"
              value={config.basePath}
              onChange={handleChange}
              margin="normal"
              placeholder="e.g., /api"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save & Reload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ApiConfigManager;