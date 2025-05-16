import { createContext, useContext } from "react"
import { GraphInput, GraphOutput } from "./types"

interface GraphContextType {
  streamMessage: (input: GraphInput) => Promise<GraphOutput>
}

const GraphContext = createContext<GraphContextType | null>(null)

export function useGraph() {
  const context = useContext(GraphContext)
  if (!context) {
    throw new Error("useGraph must be used within a GraphProvider")
  }
  return context
}

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const streamMessage = async (input: GraphInput): Promise<GraphOutput> => {
    // TODO: Implement actual message streaming
    return {
      type: "message",
      content: "Message received",
      metadata: {
        crewAIResponse: input.metadata?.crewAIConfig
      }
    }
  }

  return (
    <GraphContext.Provider value={{ streamMessage }}>
      {children}
    </GraphContext.Provider>
  )
} 