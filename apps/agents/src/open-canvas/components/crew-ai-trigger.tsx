import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBasicCrewAIConfig } from "../nodes/crew-ai/utils"
import { useState } from "react"

interface CrewAITriggerProps {
  onTrigger: (config: any) => void
  className?: string
}

export function CrewAITrigger({ onTrigger, className }: CrewAITriggerProps) {
  const [taskDescription, setTaskDescription] = useState("")
  const [context, setContext] = useState("")

  const handleTrigger = () => {
    if (!taskDescription) return

    const config = createBasicCrewAIConfig(taskDescription, {
      additionalContext: context || undefined
    })

    onTrigger(config)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>CrewAI Process</CardTitle>
        <CardDescription>
          Configure and trigger a CrewAI process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task">Task Description</Label>
          <Input
            id="task"
            placeholder="Enter the task description..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            placeholder="Enter any additional context..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleTrigger}
          disabled={!taskDescription}
          className="w-full"
        >
          Start CrewAI Process
        </Button>
      </CardContent>
    </Card>
  )
} 