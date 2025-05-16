"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CrewAITrigger } from "@/components/crew-ai-trigger"
import { useGraph } from "@/lib/graph"
import { GraphInput } from "@/lib/graph/types"

export function CrewAITriggerDialog() {
  const { streamMessage } = useGraph()

  // Async handler to POST to the Python backend
  async function handleTrigger(config: any) {
    const input: GraphInput = {
      type: "message",
      content: `/crew: ${config.taskDescription}`,
      metadata: {
        crewAIConfig: config
      }
    }
    // Map all task_configs fields to snake_case
    const snakeCaseTaskConfigs = config.taskConfigs.map((t: any) => ({
      description: t.description,
      agent_role: t.agentRole,
      expected_output: t.expectedOutput,
    }))
    // Ensure context is always a dictionary
    let contextDict: Record<string, any> = {}
    if (typeof config.context === "string" && config.context.trim() !== "") {
      contextDict = { "additional_context": config.context }
    } else if (typeof config.context === "object" && config.context !== null) {
      contextDict = config.context
    }
    // else leave as empty object
    const res = await fetch("http://localhost:8000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        task_description: config.taskDescription,
        context: contextDict,
        agent_configs: config.agentConfigs,
        task_configs: snakeCaseTaskConfigs,
        process_type: config.processType,
      })
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`CrewAI backend error: ${res.status} ${res.statusText} - ${errorText}`)
    }
    const data = await res.json()
    if (typeof window !== "undefined" && window.addCrewAIArtifact) {
      window.addCrewAIArtifact({
        type: "crewai",
        title: 'CrewAI Result',
        content: data.result.tasks_output ?? data.result,
        createdAt: new Date().toISOString(),
      })
    }
    return data
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CrewAI Process</DialogTitle>
        </DialogHeader>
        <CrewAITrigger onTrigger={handleTrigger} />
      </DialogContent>
    </Dialog>
  )
} 