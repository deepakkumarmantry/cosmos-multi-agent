"""
Streamlit frontend application for Azure Cosmos DB support chat.

This script provides a chat interface using Streamlit that communicates with a backend service
to get expert advice on Azure Cosmos DB from specialized agents.
"""

import base64
import json
import logging
import os
import requests
import streamlit as st
from dotenv import load_dotenv
from io import StringIO
from subprocess import run, PIPE


def load_dotenv_from_azd():
    """
    Load environment variables from Azure Developer CLI (azd) or fallback to .env file.

    Attempts to retrieve environment variables using the 'azd env get-values' command.
    If unsuccessful, falls back to loading from a .env file.
    """
    result = run("azd env get-values", stdout=PIPE, stderr=PIPE, shell=True, text=True)
    if result.returncode == 0:
        logging.info(f"Found AZD environment. Loading...")
        load_dotenv(stream=StringIO(result.stdout))
    else:
        logging.info(f"AZD environment not found. Trying to load from .env file...")
        load_dotenv()


def get_principal_id():
    """
    Retrieve the current user's principal ID from request headers.
    If the application is running in Azure Container Apps, and is configured for authentication,
    the principal ID is extracted from the 'x-ms-client-principal-id' header.
    If the header is not present, a default user ID is returned.

    Returns:
        str: The user's principal ID if available, otherwise 'default_user_id'
    """
    result = st.context.headers.get("x-ms-client-principal-id")
    logging.info(f"Retrieved principal ID: {result if result else 'default_user_id'}")
    return result if result else "default_user_id"


def get_principal_display_name():
    """
    Get the display name of the current user from the request headers.

    Extracts user information from the 'x-ms-client-principal' header used in
    Azure Container Apps authentication.

    Returns:
        str: The user's display name if available, otherwise 'Default User'
    """
    default_user_name = "Default User"
    principal = st.context.headers.get("x-ms-client-principal")
    if principal:
        principal = json.loads(base64.b64decode(principal).decode("utf-8"))
        claims = principal.get("claims", [])
        return next(
            (claim["val"] for claim in claims if claim["typ"] == "name"),
            default_user_name,
        )
    else:
        return default_user_name


def is_valid_json(json_string):
    """
    Validate if a string is properly formatted JSON.

    Args:
        json_string (str): The string to validate as JSON

    Returns:
        bool: True if string is valid JSON, False otherwise
    """
    try:
        json.loads(json_string)
        return True
    except json.JSONDecodeError:
        return False


# Initialize environment
load_dotenv_from_azd()

# Set page config
st.set_page_config(
    page_title="Azure Cosmos DB Support Chat", page_icon="💬", layout="wide"
)

# Initialize session state for messages if it doesn't exist
if "messages" not in st.session_state:
    st.session_state.messages = []

# Initialize session state for status messages
if "status_messages" not in st.session_state:
    st.session_state.status_messages = []

# Initialize session state for debate details toggle
if "show_debate_details" not in st.session_state:
    st.session_state.show_debate_details = False

# Initialize session state for max iterations
if "max_iterations" not in st.session_state:
    st.session_state.max_iterations = 10

# Setup sidebar with user information and logout link
st.sidebar.title("Azure Cosmos DB Support")
st.sidebar.write(f"Welcome, {get_principal_display_name()}!")
st.sidebar.markdown(
    '<a href="/.auth/logout" target = "_self">Sign Out</a>', unsafe_allow_html=True
)

# Add configuration options in the sidebar
st.sidebar.markdown("---")
st.sidebar.header("Configuration")

# Add toggle for debate details
st.session_state.show_debate_details = st.sidebar.checkbox(
    "Include debate details in response",
    value=st.session_state.show_debate_details,
    help="Show the full conversation between AI agents",
)

# Add slider for maximum iterations
st.session_state.max_iterations = st.sidebar.slider(
    "Maximum agent iterations",
    min_value=1,
    max_value=20,
    value=st.session_state.max_iterations,
    help="Maximum number of conversation turns between agents",
)

# Add some helpful information in the sidebar
st.sidebar.markdown("---")
st.sidebar.header("About the Cosmos DB Support Chat")
st.sidebar.markdown("""
This chat interface connects you with specialized Azure Cosmos DB agents that can help with:

- Evaluating if Cosmos DB fits your use case
- Designing optimal data models and schemas
- Understanding pricing and cost optimization
- Planning integration with other Azure services

Ask a specific question to get started!
""")

# Main content area - chat interface
st.title("Azure Cosmos DB Support Chat")
st.markdown(
    "Chat with specialized Azure Cosmos DB agents to get expert advice on your database needs."
)

# Display chat messages from history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        if message["role"] == "assistant":
            # Show thinking process if available in history
            if "status_messages" in message:
                with st.expander(
                    "🤔 Thinking Process (Click to hide details)", expanded=False
                ):
                    st.markdown("**Evaluating your Cosmos DB requirements...**")
                    st.markdown("")
                    for status_msg in message["status_messages"]:
                        st.markdown(f"• {status_msg}")

            # Show main response
            st.markdown(message["content"])

            # Show debate details if available and enabled
            if "debate_details" in message and st.session_state.show_debate_details:
                with st.expander("View detailed agent conversation"):
                    for detail in message["debate_details"]:
                        st.write(
                            f"**{detail.get('name', detail.get('role', 'Agent'))}:** {detail.get('content', '')}"
                        )
        else:
            # User messages
            st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("Ask about Azure Cosmos DB..."):
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)

    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Call API to get response
    with st.chat_message("assistant"):
        response_placeholder = st.empty()

        # Create thinking process expander that updates in real-time
        thinking_expander = st.expander(
            "🤔 Thinking Process (Click to hide details)", expanded=True
        )

        with thinking_expander:
            thinking_container = st.container()
            thinking_status = st.empty()

        try:
            # Reset status messages for this conversation
            st.session_state.status_messages = []

            # Call backend API to get response with updated payload
            url = f"{os.getenv('BACKEND_ENDPOINT', 'http://localhost:8000')}/api/v1/cosmos-support"
            payload = {
                "question": prompt,
                "user_id": get_principal_id(),
                "include_debate_details": st.session_state.show_debate_details,
                "maximum_iterations": st.session_state.max_iterations,
            }

            # Show initial status
            with thinking_container:
                st.markdown("**Evaluating your Cosmos DB requirements...**")

            with requests.post(url, json=payload, stream=True) as response:
                final_response = None
                debate_details = []

                for line in response.iter_lines():
                    if not line:
                        continue

                    result = line.decode("utf-8").strip()

                    if not result:
                        continue

                    # All responses should now be valid JSON with type field
                    if is_valid_json(result):
                        parsed_result = json.loads(result)

                        if parsed_result.get("type") == "status":
                            # Handle status update
                            agent = parsed_result.get("agent")
                            message = parsed_result.get("message", "")

                            # Format status message with agent info if available
                            if agent:
                                # Highlight agent names with colors
                                if "CRITIC" in agent.upper():
                                    status_msg = f"**:blue[{agent}]**: {message}"
                                elif "COSMOS" in agent.upper():
                                    status_msg = f"**:green[{agent}]**: {message}"
                                elif "INTEGRATION" in agent.upper():
                                    status_msg = f"**:orange[{agent}]**: {message}"
                                else:
                                    status_msg = f"**:gray[{agent}]**: {message}"
                            else:
                                status_msg = f"**AGENT**: {message}"

                            st.session_state.status_messages.append(status_msg)

                            # Update the thinking process container
                            with thinking_container:
                                st.markdown(
                                    "**Evaluating your Cosmos DB requirements...**"
                                )
                                st.markdown("")
                                for msg in st.session_state.status_messages:
                                    st.markdown(f"• {msg}")

                        elif parsed_result.get("type") == "response":
                            # Handle final response
                            final_response = parsed_result.get("final_answer", {})
                            debate_details = parsed_result.get("debate_details", [])
                            break
                    else:
                        # Fallback: treat as plain text status message
                        status_msg = f"**AGENT**: {result}"
                        st.session_state.status_messages.append(status_msg)

                        # Update the thinking process container
                        with thinking_container:
                            st.markdown("**Evaluating your Cosmos DB requirements...**")
                            st.markdown("")
                            for msg in st.session_state.status_messages:
                                st.markdown(f"• {msg}")

                # Display final response
                if final_response:
                    response_content = final_response.get(
                        "content", "Sorry, I couldn't generate a response."
                    )
                    response_placeholder.markdown(response_content)

                    # Prepare message for chat history
                    assistant_message = {
                        "role": "assistant",
                        "content": response_content,
                    }

                    # Add status messages to chat history for replay
                    if st.session_state.status_messages:
                        assistant_message["status_messages"] = (
                            st.session_state.status_messages.copy()
                        )

                    # Add debate details if available
                    if debate_details:
                        assistant_message["debate_details"] = debate_details

                    # Add assistant response to chat history
                    st.session_state.messages.append(assistant_message)

                else:
                    response_placeholder.markdown(
                        "Sorry, I couldn't generate a response."
                    )

        except Exception as e:
            st.error(f"Error communicating with the backend: {str(e)}")
            logging.error(f"API request failed: {str(e)}")
