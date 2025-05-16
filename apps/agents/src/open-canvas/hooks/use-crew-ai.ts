import { useState } from "react"
import { OpenCanvasGraphAnnotation } from "../state"

export function useCrewAI() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const triggerCrewAI = async (config: typeof OpenCanvasGraphAnnotation.State["crewAIConfig"]) => {
    try {
      setIsProcessing(true)
      setError(null)

      // Update the state with the CrewAI configuration
      const newState = {
        crewAIConfig: config,
        next: "crewAI"
      }

      // Here you would typically dispatch this to your state management system
      // For example, using your existing state management solution
      // dispatch({ type: "UPDATE_STATE", payload: newState })

      return newState
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    error,
    triggerCrewAI
  }
} 