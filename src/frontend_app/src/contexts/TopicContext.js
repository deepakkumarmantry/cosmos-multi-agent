import React, { createContext, useState, useContext } from 'react';

const TopicContext = createContext();

export function useTopicContext() {
  return useContext(TopicContext);
}

export function TopicProvider({ children }) {
  // Initialize with null to show the topic selector by default
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // List of topics for Azure Cosmos DB support
  const topics = [
    { 
      id: 'general', 
      title: 'General Questions', 
      description: 'Basic information about Cosmos DB', 
      icon: 'help_outline',
      sampleQuestion: 'What is Azure Cosmos DB and how does it compare to other databases?'
    },
    { 
      id: 'provisioning', 
      title: 'Provisioning & Scaling', 
      description: 'Set up and scale your database', 
      icon: 'tune',
      sampleQuestion: 'How do I provision throughput and scale my Cosmos DB resources effectively?'
    },
    { 
      id: 'api', 
      title: 'API Integration', 
      description: 'Working with various APIs', 
      icon: 'code',
      sampleQuestion: 'Can you show me an example of using the SQL API with Cosmos DB?'
    },
    { 
      id: 'performance', 
      title: 'Performance Optimization', 
      description: 'Improve query performance', 
      icon: 'speed',
      sampleQuestion: 'What are the best practices for optimizing query performance in Cosmos DB?'
    },
    { 
      id: 'security', 
      title: 'Security & Compliance', 
      description: 'Secure your Cosmos DB', 
      icon: 'security',
      sampleQuestion: 'How can I implement robust security measures for my Cosmos DB account?'
    },
    { 
      id: 'troubleshooting', 
      title: 'Troubleshooting', 
      description: 'Resolve common issues', 
      icon: 'build',
      sampleQuestion: 'How do I troubleshoot connection issues with my Cosmos DB instance?'
    }
  ];

  const selectTopic = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    setSelectedTopic(topic);
    return topic;
  };
  
  const resetTopic = () => {
    setSelectedTopic(null);
  };

  return (
    <TopicContext.Provider value={{ topics, selectedTopic, selectTopic, resetTopic }}>
      {children}
    </TopicContext.Provider>
  );
}