import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export function useSettingsContext() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  // Initialize settings with default values or from localStorage
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('cosmos_db_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      includeDebateDetails: false,
      maxIterations: 10,
      darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    };
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cosmos_db_settings', JSON.stringify(settings));
  }, [settings]);
  
  // Function to update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    updateSetting('darkMode', !settings.darkMode);
  };
  
  // Toggle debate details
  const toggleDebateDetails = () => {
    updateSetting('includeDebateDetails', !settings.includeDebateDetails);
  };
  
  // Update max iterations
  const setMaxIterations = (value) => {
    updateSetting('maxIterations', value);
  };
  
  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        updateSetting, 
        toggleDarkMode, 
        toggleDebateDetails,
        setMaxIterations
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}