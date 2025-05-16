import { OpenCanvasGraphAnnotation } from "../../state.js";

export function createBasicCrewAIConfig(
  taskDescription: string,
  context: Record<string, any> = {}
): typeof OpenCanvasGraphAnnotation.State["crewAIConfig"] {
  return {
    taskDescription,
    context,
    agentConfigs: [
      {
        role: "Researcher",
        goal: "Gather comprehensive information about the topic",
        backstory: "Expert researcher with years of experience in data analysis and information gathering",
      },
      {
        role: "Analyst",
        goal: "Analyze the gathered information and draw insights",
        backstory: "Skilled analyst with expertise in pattern recognition and insight generation",
      }
    ],
    taskConfigs: [
      {
        description: "Research the topic thoroughly and gather relevant information",
        agentRole: "Researcher",
        expectedOutput: "Detailed research findings with key points and sources",
      },
      {
        description: "Analyze the research findings and provide actionable insights",
        agentRole: "Analyst",
        expectedOutput: "Analysis report with key insights and recommendations",
      }
    ],
    processType: "sequential"
  };
}

export function createCustomCrewAIConfig(
  taskDescription: string,
  agentConfigs: Array<{
    role: string;
    goal: string;
    backstory: string;
    tools?: any[];
    llm?: any;
  }>,
  taskConfigs: Array<{
    description: string;
    agentRole: string;
    expectedOutput: string;
    context?: Record<string, any>;
  }>,
  context: Record<string, any> = {},
  processType: "sequential" | "hierarchical" = "sequential"
): typeof OpenCanvasGraphAnnotation.State["crewAIConfig"] {
  return {
    taskDescription,
    context,
    agentConfigs,
    taskConfigs,
    processType
  };
} 