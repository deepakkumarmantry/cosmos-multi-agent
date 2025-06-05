#!/bin/bash

# Test the Cosmos DB specialist team API
echo "Testing Cosmos DB specialist team API..."

curl -X POST http://localhost:5000/cosmos-support \
  -H "Content-Type: application/json" \
  -d '{
    "question": "I want to build a globally distributed e-commerce product catalog with millions of products. Should I use Azure Cosmos DB? How should I model the data and what would be the cost implications?",
    "user_id": "test-user-001"
  }'

# Note: This is a streaming API that returns multiple JSON responses
# Each response contains an agent name, role, and content representing 
# specialist insights from one of the four Cosmos DB experts:
# - CosmosPricing (Pricing and cost optimization)
# - CosmosDataModel (Data modeling and schema design)
# - CosmosIntegration (Integration patterns)