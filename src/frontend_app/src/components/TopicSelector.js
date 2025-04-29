import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  useTheme,
  Fade,
  Button,
  Zoom
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TuneIcon from '@mui/icons-material/Tune';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import BuildIcon from '@mui/icons-material/Build';
import { useTopicContext } from '../contexts/TopicContext';
import { useChatContext } from '../contexts/ChatContext';

// Map icon names to Material UI icon components
const iconMap = {
  'help_outline': <HelpOutlineIcon />,
  'tune': <TuneIcon />,
  'code': <CodeIcon />,
  'speed': <SpeedIcon />,
  'security': <SecurityIcon />,
  'build': <BuildIcon />
};

function TopicSelector({ darkMode }) {
  const { topics, selectTopic } = useTopicContext();
  const { sendMessage } = useChatContext();
  const theme = useTheme();
  
  const handleTopicClick = (topicId) => {
    const topic = selectTopic(topicId);
    if (topic && topic.sampleQuestion) {
      // Small delay to allow the welcome message to appear first
      setTimeout(() => {
        sendMessage(topic.sampleQuestion);
      }, 800);
    }
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', mt: 4, px: 2 }}>
      <Fade in={true} timeout={500}>
        <Box>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Zoom in={true} timeout={800}>
              <Box 
                sx={{ 
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                  mb: 2
                }}
              >
                <img 
                  src="/cosmos-db-logo.png" 
                  alt="Azure Cosmos DB Logo" 
                  className="cosmos-logo"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }} 
                />
                <Box 
                  className="cosmos-star"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: 0,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#50E6FF',
                    filter: 'blur(2px)'
                  }}
                />
                <Box 
                  className="cosmos-star"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: -10,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#50E6FF',
                    filter: 'blur(2px)'
                  }}
                />
              </Box>
            </Zoom>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
              Azure Cosmos DB Support Chat
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Chat with specialized Azure Cosmos DB agents to get expert advice on your database needs.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3, mt: 6 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select a topic to get started:
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(260px, 1fr))'
            },
            gap: 3
          }}>
            {topics.map((topic, index) => (
              <Zoom key={topic.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card 
                  className="topic-card"
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    bgcolor: topic.id === 'performance' ? theme.palette.primary.main : 
                            topic.id === 'api' ? (darkMode ? '#1a334d' : '#E8F5FE') :
                            topic.id === 'security' ? (darkMode ? '#1a3047' : '#E6F3FF') : 
                            darkMode ? '#1e1e1e' : 'white',
                    color: topic.id === 'performance' ? 'white' : 
                            darkMode ? 'white' : 'inherit',
                    boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
                    '& .topic-icon': {
                      bgcolor: topic.id === 'performance' ? 'rgba(255,255,255,0.2)' : 
                                topic.id === 'api' ? '#50B0F9' :
                                topic.id === 'security' ? '#0078D4' : theme.palette.primary.main,
                      color: topic.id === 'performance' ? 'white' : 
                              topic.id === 'api' ? 'white' :
                              topic.id === 'security' ? 'white' : 'white'
                    },
                    '& .topic-description': {
                      color: topic.id === 'performance' ? 'rgba(255,255,255,0.8)' : 
                             darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                    }
                  }}
                  onClick={() => handleTopicClick(topic.id)}
                >
                  <CardContent sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    p: 3
                  }}>
                    <Box 
                      className="topic-icon"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '8px',
                        mb: 2
                      }}
                    >
                      {iconMap[topic.icon]}
                    </Box>
                    <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 600 }}>
                      {topic.title}
                    </Typography>
                    <Typography variant="body2" className="topic-description">
                      {topic.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<HelpOutlineIcon />}
              sx={{ 
                borderRadius: 20, 
                px: 3, 
                py: 1,
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(0, 120, 212, 0.25)'
                  : '0 2px 8px rgba(0, 120, 212, 0.15)',
                color: darkMode ? '#fff' : undefined,
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : undefined,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 4px 12px rgba(0, 120, 212, 0.4)'
                    : '0 4px 12px rgba(0, 120, 212, 0.2)',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : undefined,
                },
                transition: 'all 0.3s ease'
              }}
            >
              Ask a specific question to get started
            </Button>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

export default TopicSelector;