import { OpenCanvasGraphAnnotation } from "../../state.js";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { z } from "zod";

// Schema for CrewAI process input
const CrewAIProcessInputSchema = z.object({
  taskDescription: z.string(),
  context: z.record(z.any()).optional(),
  agentConfigs: z.array(z.object({
    role: z.string(),
    goal: z.string(),
    backstory: z.string(),
    tools: z.array(z.any()).optional(),
    llm: z.any().optional()
  })),
  taskConfigs: z.array(z.object({
    description: z.string(),
    agentRole: z.string(),
    expectedOutput: z.string(),
    context: z.record(z.any()).optional()
  })),
  processType: z.enum(["sequential", "hierarchical"]).default("sequential")
});

type CrewAIProcessInput = z.infer<typeof CrewAIProcessInputSchema>;

export const crewAINode = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
) => {
  try {
    console.log("CrewAI Node: Starting process");
    console.log("CrewAI Node: State:", JSON.stringify(state, null, 2));

    // Extract CrewAI configuration from the state
    const crewAIConfig = state.crewAIConfig;
    if (!crewAIConfig) {
      console.error("CrewAI Node: No configuration found in state");
      throw new Error("No CrewAI configuration found in state");
    }

    // Validate the configuration
    console.log("CrewAI Node: Validating configuration");
    const validatedConfig = CrewAIProcessInputSchema.parse(crewAIConfig);
    console.log("CrewAI Node: Validated config:", JSON.stringify(validatedConfig, null, 2));

    // Call the CrewAI API
    console.log("CrewAI Node: Calling CrewAI API");
    const response = await fetch("http://localhost:8000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(validatedConfig),
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CrewAI Node: API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`CrewAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("CrewAI Node: Received result:", JSON.stringify(result, null, 2));

    // Update the state with the CrewAI results
    return {
      crewAIResults: result,
      next: "generateFollowup"
    };
  } catch (error) {
    console.error("CrewAI Node: Error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error in CrewAI node",
      next: "replyToGeneralInput"
    };
  }
}; 