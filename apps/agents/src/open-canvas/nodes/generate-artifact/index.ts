import {
  createContextDocumentMessages,
  getFormattedReflections,
  getModelConfig,
  getModelFromConfig,
  isUsingO1MiniModel,
  optionallyGetSystemPromptFromConfig,
} from "../../../utils.js";
import { ArtifactV3 } from "@opencanvas/shared/types";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import {
  OpenCanvasGraphAnnotation,
  OpenCanvasGraphReturnType,
} from "../../state.js";
import { ARTIFACT_TOOL_SCHEMA } from "./schemas.js";
import { createArtifactContent, formatNewArtifactPrompt } from "./utils.js";
import { z } from "zod";

export const SECTOR_DEEP_DIVE_PROMPT = `You are an AI assistant tasked with generating a comprehensive sector deep dive analysis.
First, I will search the web for relevant information about the sector to ensure our analysis is up-to-date and accurate.

[Web search results will be provided here]

Based on the web search results and your knowledge, generate a comprehensive analysis structured into the following sections:

[... rest of the prompt ...]`;

export const ROUTE_QUERY_PROMPT = `... existing prompt ...

If the user's message matches any of the following patterns, route to the corresponding quick action:
- "Do a sector deep dive on [topic]" -> sector-deep-dive quick action
- "Analyze this market" -> sector-deep-dive quick action
- [Other quick action triggers]

... rest of prompt ...`;

const schema = z.object({
  route: z.enum([
    "replyToGeneralInput", 
    "rewriteArtifact", 
    "generateArtifact",
    "customAction"  // New route
  ]),
  customQuickActionId: z.string().optional()  // ID of the quick action to trigger
});

const sectorDeepDiveQuickAction = {
  id: "sector-deep-dive",
  title: "Sector Deep Dive",
  prompt: SECTOR_DEEP_DIVE_PROMPT,
  includeReflections: true,
  includePrefix: true,
  includeRecentHistory: true,
  webSearchEnabled: true  // This will trigger web search
};

/**
 * Generate a new artifact based on the user's query.
 */
export const generateArtifact = async (
  state: typeof OpenCanvasGraphAnnotation.State,
  config: LangGraphRunnableConfig
): Promise<OpenCanvasGraphReturnType> => {
  const { modelName } = getModelConfig(config, {
    isToolCalling: true,
  });
  const smallModel = await getModelFromConfig(config, {
    temperature: 0.5,
    isToolCalling: true,
  });

  const modelWithArtifactTool = smallModel.bindTools(
    [
      {
        name: "generate_artifact",
        description: ARTIFACT_TOOL_SCHEMA.description,
        schema: ARTIFACT_TOOL_SCHEMA,
      },
    ],
    {
      tool_choice: "generate_artifact",
    }
  );

  const memoriesAsString = await getFormattedReflections(config);
  const formattedNewArtifactPrompt = formatNewArtifactPrompt(
    memoriesAsString,
    modelName
  );

  const userSystemPrompt = optionallyGetSystemPromptFromConfig(config);
  const fullSystemPrompt = userSystemPrompt
    ? `${userSystemPrompt}\n${formattedNewArtifactPrompt}`
    : formattedNewArtifactPrompt;

  const contextDocumentMessages = await createContextDocumentMessages(config);
  const isO1MiniModel = isUsingO1MiniModel(config);
  const response = await modelWithArtifactTool.invoke(
    [
      { role: isO1MiniModel ? "user" : "system", content: fullSystemPrompt },
      ...contextDocumentMessages,
      ...state._messages,
    ],
    { runName: "generate_artifact" }
  );
  const args = response.tool_calls?.[0].args as
    | z.infer<typeof ARTIFACT_TOOL_SCHEMA>
    | undefined;
  if (!args) {
    throw new Error("No args found in response");
  }

  const newArtifactContent = createArtifactContent(args);
  const newArtifact: ArtifactV3 = {
    currentIndex: 1,
    contents: [newArtifactContent],
  };

  return {
    artifact: newArtifact,
  };
};

export const handleRouting = (routingResult: z.infer<typeof schema>) => {
  if (routingResult?.customQuickActionId) {
    return {
      next: "customAction",
      customQuickActionId: routingResult.customQuickActionId,
    };
  }
  return {
    next: routingResult.route,
  };
};
