import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Sample code snippets for testing
const codeExamples = {
  json: `{
  "id": "cosmosdb-container-1",
  "partitionKey": {
    "paths": [
      "/customerId"
    ],
    "kind": "Hash"
  },
  "indexingPolicy": {
    "indexingMode": "consistent",
    "automatic": true,
    "includedPaths": [
      {
        "path": "/*"
      }
    ],
    "excludedPaths": [
      {
        "path": "/metadata/*"
      }
    ],
    "compositeIndexes": [
      [
        {
          "path": "/orderDate",
          "order": "ascending"
        },
        {
          "path": "/customerId",
          "order": "ascending"
        }
      ]
    ]
  },
  "defaultTtl": 86400,
  "uniqueKeyPolicy": {
    "uniqueKeys": [
      {
        "paths": [
          "/email",
          "/customerId"
        ]
      }
    ]
  }
}`,
  javascript: `const { CosmosClient } = require("@azure/cosmos");

// Initialize Cosmos client
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const client = new CosmosClient({ endpoint, key });

async function createAndQueryItems() {
  // Create database and container if they don't exist
  const { database } = await client.databases.createIfNotExists({ id: "ToDoList" });
  const { container } = await database.containers.createIfNotExists({ id: "Items" });
  
  // Create a new item
  const newItem = {
    id: "1",
    category: "personal",
    name: "Take dog for a walk",
    description: "Walking helps both me and my dog stay healthy",
    isComplete: false,
    priority: 1
  };
  
  // Add new item to the container
  const { resource: createdItem } = await container.items.create(newItem);
  console.log(\`Created new item: \${createdItem.id}\`);
  
  // Query items
  const querySpec = {
    query: "SELECT * FROM c WHERE c.category = @category",
    parameters: [
      {
        name: "@category",
        value: "personal"
      }
    ]
  };
  
  const { resources: items } = await container.items.query(querySpec).fetchAll();
  console.log(\`Found \${items.length} items matching the criteria\`);
  return items;
}`,
  csharp: `using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CosmosDBSample
{
    public class CosmosOperations
    {
        private readonly CosmosClient _cosmosClient;
        private readonly Container _container;

        public CosmosOperations(string endpoint, string key, string databaseId, string containerId)
        {
            _cosmosClient = new CosmosClient(endpoint, key, new CosmosClientOptions
            {
                ConnectionMode = ConnectionMode.Direct,
                ApplicationRegion = Regions.WestUS2
            });
            
            var database = _cosmosClient.GetDatabase(databaseId);
            _container = database.GetContainer(containerId);
        }

        public async Task<IEnumerable<T>> QueryItemsAsync<T>(string queryText)
        {
            var query = _container.GetItemQueryIterator<T>(new QueryDefinition(queryText));
            var results = new List<T>();
            
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }
            
            return results;
        }

        public async Task<ItemResponse<T>> CreateItemAsync<T>(T item, string partitionKeyValue)
        {
            return await _container.CreateItemAsync(item, new PartitionKey(partitionKeyValue));
        }
    }
}`
};

function CodeTestDisplay() {
  // Theme is used for styled components setup but not explicitly referenced
  const [language, setLanguage] = React.useState('json');
  const [darkTheme, setDarkTheme] = React.useState(true);

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Code Syntax Highlighting Test
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select a language to test syntax highlighting:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant={language === 'json' ? 'contained' : 'outlined'} 
              onClick={() => setLanguage('json')}
              size="small"
            >
              JSON
            </Button>
            <Button 
              variant={language === 'javascript' ? 'contained' : 'outlined'} 
              onClick={() => setLanguage('javascript')}
              size="small"
            >
              JavaScript
            </Button>
            <Button 
              variant={language === 'csharp' ? 'contained' : 'outlined'} 
              onClick={() => setLanguage('csharp')}
              size="small"
            >
              C#
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select a theme:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant={darkTheme ? 'contained' : 'outlined'} 
              onClick={() => setDarkTheme(true)}
              size="small"
            >
              Dark
            </Button>
            <Button 
              variant={!darkTheme ? 'contained' : 'outlined'} 
              onClick={() => setDarkTheme(false)}
              size="small"
            >
              Light
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -6, 
              right: 16, 
              bgcolor: darkTheme ? '#2d2d2d' : '#f5f5f5',
              color: darkTheme ? '#aaa' : '#666',
              fontSize: '11px',
              borderRadius: '4px',
              px: 1,
              py: 0.25,
              zIndex: 1
            }}
          >
            {language}
          </Box>
          <SyntaxHighlighter
            language={language}
            style={darkTheme ? atomDark : oneLight}
            customStyle={{
              borderRadius: '8px',
              margin: '0',
              padding: '16px',
              fontSize: '13px',
              boxShadow: darkTheme ? 'none' : '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {codeExamples[language]}
          </SyntaxHighlighter>
        </Box>
      </Paper>
    </Box>
  );
}

export default CodeTestDisplay;