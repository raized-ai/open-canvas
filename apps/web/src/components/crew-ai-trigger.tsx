"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface CrewAITriggerProps {
  onTrigger: (config: any) => Promise<any> | void
  className?: string
}

export function CrewAITrigger({ onTrigger, className }: CrewAITriggerProps) {
  const [taskDescription, setTaskDescription] = useState("")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleTrigger() {
    if (!taskDescription) return
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)
    try {
      await onTrigger({
        taskDescription,
        context: context || undefined,
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
      })
      setIsSuccess(true)
      setTaskDescription("")
      setContext("")
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
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
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            placeholder="Enter any additional context..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button 
          onClick={handleTrigger}
          disabled={!taskDescription || isLoading}
          className="w-full"
        >
          {isLoading ? "Processing..." : isSuccess ? "Success!" : "Start CrewAI Process"}
        </Button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </CardContent>
    </Card>
  )
} 