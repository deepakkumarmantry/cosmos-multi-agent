"""
FastAPI backend application for blog post generation using AI debate orchestration.

This module initializes a FastAPI application that exposes endpoints for generating
blog posts using a debate pattern orchestrator, with appropriate logging, tracing,
and metrics configurations.
"""

import json
import logging
import os
from fastapi import FastAPI, Body
from fastapi.responses import StreamingResponse
from patterns.debate import DebateOrchestrator
from utils.util import (
    load_dotenv_from_azd,
    set_up_tracing,
    set_up_metrics,
    set_up_logging,
)
from fastapi.middleware.cors import CORSMiddleware

load_dotenv_from_azd()
set_up_tracing()
set_up_metrics()
set_up_logging()

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:   %(name)s   %(message)s",
)
logger = logging.getLogger(__name__)
logging.getLogger("azure.core.pipeline.policies.http_logging_policy").setLevel(
    logging.WARNING
)
logging.getLogger("azure.monitor.opentelemetry.exporter.export").setLevel(
    logging.WARNING
)

# Choose patterns to use
debate_orchestrator = DebateOrchestrator()

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info(
    "Diagnostics: %s",
    os.getenv("SEMANTICKERNEL_EXPERIMENTAL_GENAI_ENABLE_OTEL_DIAGNOSTICS"),
)


@app.post("/api/v1/cosmos-support")
async def http_cosmos_support(request_body: dict = Body(...)):
    """
    Generate a blog post about a specified topic using the debate orchestrator.

    Args:
        request_body (dict): JSON body containing 'topic' and 'user_id' fields.
            - topic (str): The subject for the blog post. Defaults to 'Starwars'.
            - user_id (str): Identifier for the user making the request. Defaults to 'default_user'.

    Returns:
        StreamingResponse: A streaming response.
        Chunk can be be either a string or contain JSON.
        If the chunk is a string it is a status update.
        JSON will contain the generated blog post content.
    """
    logger.info("API request received with body %s", request_body)

    question = request_body.get("question", "Tell me about Azure Cosmos DB")
    user_id = request_body.get("user_id", "default_user")
   

    conversation_messages = []
    conversation_messages.append({"role": "user", "name": "user", "content": question})

    async def doit():
        """
        Asynchronous generator that streams debate orchestrator responses.

        Yields:
            str: Chunks of the generated blog post content with newline characters appended.
        """
        async for i in debate_orchestrator.process_conversation(
            user_id, conversation_messages
        ):
            yield i + "\n"

    return StreamingResponse(doit(), media_type="application/json")

