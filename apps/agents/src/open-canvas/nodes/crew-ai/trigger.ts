import { OpenCanvasGraphAnnotation } from "../../state.js";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { createBasicCrewAIConfig, createCustomCrewAIConfig } from "./utils.js";

export async function triggerCrewAIProcess(
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
) {
  // Example of using the basic configuration
  const basicConfig = createBasicCrewAIConfig(
    "Research and analyze the latest developments in AI",
    {
      // Add any additional context here
      focusAreas: ["Machine Learning", "Natural Language Processing"],
      timeframe: "Last 6 months"
    }
  );

  // Example of using a custom configuration
  const customConfig = createCustomCrewAIConfig(
    "Create a comprehensive analysis of the given topic",
    [
      {
        role: "Research Specialist",
        goal: "Conduct in-depth research on the topic",
        backstory: "Expert in research methodology with a focus on emerging technologies",
      },
      {
        role: "Content Strategist",
        goal: "Transform research into actionable insights",
        backstory: "Experienced in creating compelling narratives from complex information",
      }
    ],
    [
      {
        description: "Research the topic and gather key information",
        agentRole: "Research Specialist",
        expectedOutput: "Comprehensive research report",
      },
      {
        description: "Create a strategic analysis based on the research",
        agentRole: "Content Strategist",
        expectedOutput: "Strategic analysis with recommendations",
      }
    ],
    {
      // Add any additional context here
      targetAudience: "Technical decision makers",
      format: "Executive summary"
    }
  );

  // You can choose which configuration to use
  const selectedConfig = basicConfig; // or customConfig

  return {
    ...state,
    crewAIConfig: selectedConfig,
    next: "crewAI"
  };
} 