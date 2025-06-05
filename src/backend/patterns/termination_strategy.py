# from semantic_kernel.agents.strategies.termination.termination_strategy import (
#     TerminationStrategy,
# )
# from semantic_kernel.agents import Agent
# from semantic_kernel.contents.chat_message_content import ChatMessageContent
# from typing import List


# class CosmosDBTerminationStrategy(TerminationStrategy):
#     """
#     Custom termination strategy for Cosmos DB conversations.
#     Terminates when:
#     1. A critic agent approves the solution
#     2. Maximum iterations are reached
#     3. The conversation reaches a natural conclusion
#     """

#     def __init__(self, maximum_iterations: int = 10):
#         self.maximum_iterations = maximum_iterations
#         self.iteration_count = 0

#     async def should_agent_terminate(
#         self, agent: Agent, history: List[ChatMessageContent]
#     ) -> bool:
#         """
#         Determine if the conversation should terminate.

#         Args:
#             agent: The current agent
#             history: The conversation history

#         Returns:
#             bool: True if the conversation should terminate
#         """
#         self.iteration_count += 1

#         # Check maximum iterations
#         if self.iteration_count >= self.maximum_iterations:
#             return True

#         # Check if we have enough messages to evaluate
#         if len(history) < 2:
#             return False

#         # Get the last few messages
#         recent_messages = history[-3:] if len(history) >= 3 else history

#         # Check for approval or completion keywords in recent messages
#         completion_keywords = [
#             "approved",
#             "solution complete",
#             "final answer",
#             "complete solution provided",
#             "ready to submit",
#             "task completed",
#         ]

#         for message in recent_messages:
#             content_lower = message.content.lower()

#             # If this is from a critic agent and contains approval language
#             if (
#                 hasattr(message, "name")
#                 and message.name
#                 and "critic" in message.name.lower()
#                 and any(keyword in content_lower for keyword in completion_keywords)
#             ):
#                 return True

#             # If any message indicates completion
#             if any(keyword in content_lower for keyword in completion_keywords):
#                 return True

#         return False


# # Update your create_agent_group_chat method to use this strategy:
# def create_agent_group_chat(
#     self, agents_directory="agents/cosmos", maximum_iterations=3
# ):
#     """
#     Creates and configures an agent group chat with Writer and Critic agents.

#     Returns:
#         AgentGroupChat: A configured group chat with specialized agents,
#                        selection strategy and termination strategy.
#     """

#     self.logger.debug("Creating chat")

#     # Load all agents from directory
#     agents = self.agent_manager.load_agents_from_directory(agents_directory)

#     if not agents:
#         raise ValueError(f"No agents found in {agents_directory}")

#     # Get critics for termination strategy
#     critics = self.agent_manager.get_critics()
#     if not critics:
#         self.logger.warning(
#             "No critic agents found. Using default termination strategy."
#         )
#         # Find any agent named "Critic-Team" if is_critic wasn't specified
#         for agent in agents:
#             if "critic" in agent.name.lower():
#                 critics.append(agent)
#                 self.logger.info(f"Using {agent.name} as critic based on name")

#     # Create agent group chat with all loaded agents
#     agent_group_chat = AgentGroupChat(
#         agents=agents,
#         selection_strategy=SequentialSelectionStrategy(),
#         termination_strategy=CosmosDBTerminationStrategy(
#             maximum_iterations=maximum_iterations
#         ),
#     )

#     return agent_group_chat
