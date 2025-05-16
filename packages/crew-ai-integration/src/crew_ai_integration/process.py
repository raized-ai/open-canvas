from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, Process
from langchain.tools import BaseTool
from langchain.llms.base import BaseLLM

class AgentConfig(BaseModel):
    """Configuration for a CrewAI agent."""
    role: str = Field(..., description="The role of the agent")
    goal: str = Field(..., description="The goal of the agent")
    backstory: str = Field(..., description="The backstory of the agent")
    tools: Optional[List[BaseTool]] = Field(default=None, description="Tools available to the agent")
    llm: Optional[BaseLLM] = Field(default=None, description="LLM to use for the agent")

class TaskConfig(BaseModel):
    """Configuration for a CrewAI task."""
    description: str = Field(..., description="Description of the task")
    agent_role: str = Field(..., description="Role of the agent to perform this task")
    expected_output: str = Field(..., description="Expected output format")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context for the task")

class CrewAIInput(BaseModel):
    """Input for the CrewAI process."""
    task_description: str = Field(..., description="Overall description of the task")
    context: Dict[str, Any] = Field(default_factory=dict, description="Context for the task")
    agent_configs: List[AgentConfig] = Field(..., description="Configurations for the agents")
    task_configs: List[TaskConfig] = Field(..., description="Configurations for the tasks")
    process_type: Process = Field(default=Process.sequential, description="Type of process to use")

def create_crew_process(input_data: CrewAIInput) -> Dict[str, Any]:
    """
    Creates and executes a CrewAI process.
    
    Args:
        input_data: Configuration for the CrewAI process
        
    Returns:
        Dict containing the results of the process
    """
    # Create agents
    agents = [
        Agent(
            role=config.role,
            goal=config.goal,
            backstory=config.backstory,
            tools=config.tools,
            llm=config.llm
        )
        for config in input_data.agent_configs
    ]
    
    # Create tasks
    tasks = []
    for task_config in input_data.task_configs:
        # Find the agent for this task
        agent = next(
            (a for a in agents if a.role == task_config.agent_role),
            None
        )
        if not agent:
            raise ValueError(f"No agent found with role {task_config.agent_role}")
            
        task = Task(
            description=task_config.description,
            agent=agent,
            expected_output=task_config.expected_output,
            context=[task_config.context] if task_config.context else []
        )
        tasks.append(task)
    
    # Create and execute the crew
    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=input_data.process_type,
        verbose=True
    )
    
    result = crew.kickoff()
    
    return {
        "result": result,
        "task_results": [task.output for task in tasks]
    } 