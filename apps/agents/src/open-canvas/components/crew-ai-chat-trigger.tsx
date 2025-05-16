import { useEffect } from "react"
import { createBasicCrewAIConfig } from "../nodes/crew-ai/utils"

interface CrewAIChatTriggerProps {
  message: string
  onTrigger: (config: any) => void
}

export function CrewAIChatTrigger({ message, onTrigger }: CrewAIChatTriggerProps) {
  useEffect(() => {
    console.log("CrewAI Chat Trigger: Checking message:", message);
    
    // Check if the message contains the trigger word
    if (message.toLowerCase().includes("/crew")) {
      console.log("CrewAI Chat Trigger: Found trigger word");
      
      // Extract the task description after the trigger word
      const taskDescription = message
        .split("/crew")[1]
        ?.trim()
        ?.replace(/^:/, "")
        ?.trim()

      console.log("CrewAI Chat Trigger: Extracted task description:", taskDescription);

      if (taskDescription) {
        console.log("CrewAI Chat Trigger: Creating configuration");
        const config = createBasicCrewAIConfig(taskDescription)
        console.log("CrewAI Chat Trigger: Created config:", config);
        onTrigger(config)
      }
    }
  }, [message, onTrigger])

  return null // This is a headless component
} 