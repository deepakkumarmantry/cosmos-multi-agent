/**
 * API Client Utility
 * 
 * Provides helper functions for making API requests with proper error handling
 * and environment variable configuration.
 */
import { ENDPOINTS } from '../config/api';

/**
 * Makes a fetch request to the API with error handling (non-streaming)
 * 
 * @param {string} url - The URL to fetch from
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The JSON response
 * @throws {Error} - If the request fails
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Using XMLHttpRequest to bypass CORS preflight
      const xhr = new XMLHttpRequest();
      
      // Open the connection
      xhr.open(options.method || 'POST', url, true);
      
      // Set headers
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      
      // Set response type to json
      xhr.responseType = 'json';
      
      // Handle completion
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`API error (${xhr.status}): ${xhr.responseText}`));
        }
      };
      
      // Handle errors
      xhr.onerror = function() {
        reject(new Error('Network error occurred'));
      };
      
      // Send the request
      xhr.send(options.body);
    } catch (error) {
      console.error('API request failed:', error);
      reject(error);
    }
  });
};

/**
 * Makes a streaming fetch request to the API with error handling
 * 
 * @param {string} url - The URL to fetch from
 * @param {Object} options - Fetch options
 * @param {Function} onChunk - Callback for each chunk of data
 * @param {Function} onComplete - Callback for completion
 * @param {Function} onError - Callback for errors
 */
export const fetchStreamWithErrorHandling = async (
  url, 
  options = {}, 
  onChunk = () => {}, 
  onComplete = () => {}, 
  onError = () => {}
) => {
  try {
    // Using XMLHttpRequest to bypass CORS preflight for streaming
    // This is similar to how your Streamlit code uses requests.post with stream=True
    const xhr = new XMLHttpRequest();
    
    // Open the connection
    xhr.open(options.method || 'POST', url, true);
    
    // Set headers
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    
    // Set response type to text for streaming processing
    xhr.responseType = 'text';
    
    // Track received data for incremental processing
    let receivedData = '';
    let finalResponse = null;
    const statusUpdates = [];

    // Process incremental responses
    xhr.onprogress = (event) => {
      try {
        // Get only the new part of the response
        const newData = xhr.responseText.substring(receivedData.length);
        receivedData = xhr.responseText;
        
        if (newData) {
          // Split by lines
          const lines = newData.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              // Each line should be a valid JSON object now with "type" field
              const parsed = JSON.parse(line);
              
              // Determine if this is a status update or final response
              if (parsed.type === "status") {
                // It's a status update with agent and message
                statusUpdates.push(parsed.message);
                
                // Debug the status update
                console.log("Status update received:", parsed);
                
                // Send to handler as status object
                onChunk({
                  isStatus: true,
                  message: parsed.message,
                  agent: parsed.agent
                }, true);
              } 
              else if (parsed.type === "response") {
                // It's the final response with an answer
                finalResponse = parsed.final_answer;
                
                // Send to handler as final response (JSON)
                onChunk(finalResponse, true);
              }
              else {
                // Unknown type, just pass it through
                onChunk(parsed, true);
              }
            } catch (e) {
              // If JSON parsing fails, treat as simple text
              console.warn('Failed to parse JSON chunk:', e, line);
              statusUpdates.push(line);
              onChunk(line, false);
            }
          }
        }
      } catch (error) {
        console.error('Error processing streaming data', error);
      }
    };
    
    // Handle completion
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (finalResponse) {
          onComplete(finalResponse);
        } else {
          // Try to parse the last line as JSON
          try {
            const lines = receivedData.split('\n').filter(line => line.trim());
            if (lines.length > 0) {
              const lastLine = lines[lines.length - 1];
              const parsed = JSON.parse(lastLine);
              onComplete(parsed);
            } else {
              onComplete({ content: "Received response but couldn't parse final result" });
            }
          } catch (e) {
            onComplete({ content: statusUpdates.join('\n') || "Request completed" });
          }
        }
      } else {
        onError(new Error(`API error (${xhr.status}): ${xhr.responseText}`));
      }
    };
    
    // Handle errors
    xhr.onerror = function() {
      onError(new Error('Network error occurred'));
    };
    
    // Send the request
    xhr.send(options.body);
  } catch (error) {
    onError(error);
  }
};

/**
 * Sends a chat message to the API
 * 
 * @param {string} message - The user's message
 * @param {string|null} topicId - The selected topic ID
 * @returns {Promise<Object>} - The API response
 */
export const sendChatMessage = async (message, topicId = null) => {
  // Get or generate a user ID
  const userId = localStorage.getItem('cosmos_user_id') || 
                `user_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store the user ID for future use
  localStorage.setItem('cosmos_user_id', userId);
  
  return fetchWithErrorHandling(ENDPOINTS.CHAT, {
    method: 'POST',
    body: JSON.stringify({
      question: message,          // API expects "question" not "message"
      user_id: userId,            // API expects "user_id"
      include_debate_details: false,  // New parameter from updated API
      max_iterations: 10,        // New parameter 
      topic_id: topicId,         // Optional topic ID
    }),
  });
};

/**
 * Sends a chat message to the API with streaming response
 * 
 * @param {string} message - The user's message
 * @param {string|null} topicId - The selected topic ID
 * @param {Function} onChunk - Callback for each chunk of data
 * @param {Function} onComplete - Callback for completion
 * @param {Function} onError - Callback for errors
 */
export const sendChatMessageStreamed = (
  message, 
  topicId = null,
  onChunk = () => {},
  onComplete = () => {},
  onError = () => {},
  options = {}
) => {
  // Get or generate a user ID
  const userId = localStorage.getItem('cosmos_user_id') || 
                `user_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store the user ID for future use
  localStorage.setItem('cosmos_user_id', userId);
  
  // Get settings from localStorage or use defaults
  const savedSettings = localStorage.getItem('cosmos_db_settings');
  const settings = savedSettings ? JSON.parse(savedSettings) : {
    includeDebateDetails: false,
    maxIterations: 10
  };
  
  // Use options if provided, otherwise use settings from localStorage
  const includeDebateDetails = options.includeDebateDetails !== undefined 
    ? options.includeDebateDetails 
    : settings.includeDebateDetails;
    
  const maxIterations = options.maxIterations !== undefined
    ? options.maxIterations
    : settings.maxIterations;
  
  // Simplified method to match your Streamlit example
  // Based on the structure from your provided Streamlit code example
  fetchStreamWithErrorHandling(
    ENDPOINTS.CHAT,
    {
      method: 'POST',
      body: JSON.stringify({
        question: message,                        // API expects "question" not "message"
        user_id: userId,                          // API expects "user_id"
        include_debate_details: includeDebateDetails,  // Use the setting
        max_iterations: maxIterations             // Use the setting
      }),
    },
    onChunk,
    onComplete,
    onError
  );
};

/**
 * Since there's no topics API, we're keeping topic management 
 * on the client side using the data in TopicContext
 */

/**
 * Set custom API configuration environment variables
 * This is useful for development or testing with different backends
 * 
 * @param {Object} config - Configuration object with host, port, etc.
 */
export const setApiConfig = (config = {}) => {
  const { host, port, protocol, basePath } = config;
  
  if (host) {
    window.process = window.process || {};
    window.process.env = window.process.env || {};
    
    if (host) window.process.env.REACT_APP_API_HOST = host;
    if (port) window.process.env.REACT_APP_API_PORT = port;
    if (protocol) window.process.env.REACT_APP_API_PROTOCOL = protocol;
    if (basePath) window.process.env.REACT_APP_API_BASE_PATH = basePath;
    
    // Force reload the app to apply new config
    window.location.reload();
  }
};