"""
Example of creating an expert team using agents defined in YAML files.

This shows how to create a group of specialized agents for collaborative problem-solving.
"""

from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import AzureChatCompletion
from semantic_kernel.agents.group_chat import AgentGroupChat
from semantic_kernel.agents.scheduling_strategies import SequentialSelectionStrategy
from semantic_kernel.agents.termination_strategies import DefaultTerminationStrategy
from utils.util import create_agent_from_yaml


async def create_expert_team(kernel, service_id="executor"):
    """
    Creates a team of expert agents loaded from YAML definitions.

    Args:
        kernel: The Semantic Kernel instance
        service_id: The service ID to use for all agents (default: "executor")

    Returns:
        AgentGroupChat: A group chat with all specialized agents
    """
    # Create agents from YAML definitions
    researcher = create_agent_from_yaml(kernel, service_id, "agents/researcher.yaml")
    innovator = create_agent_from_yaml(kernel, service_id, "agents/innovator.yaml")
    critic = create_agent_from_yaml(kernel, service_id, "agents/critic-team.yaml")
    synthesizer = create_agent_from_yaml(kernel, service_id, "agents/synthesizer.yaml")

    # Create a group chat with all specialized agents
    expert_team = AgentGroupChat(
        agents=[researcher, innovator, critic, synthesizer],
        selection_strategy=SequentialSelectionStrategy(),
        termination_strategy=DefaultTerminationStrategy(
            maximum_iterations=8
        ),  # 2 rounds of all 4 agents
    )

    return expert_team
