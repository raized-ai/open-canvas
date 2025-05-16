export interface GraphInput {
  type: "message"
  content: string
  metadata?: {
    crewAIConfig?: any
  }
}

export interface GraphOutput {
  type: "message"
  content: string
  metadata?: {
    crewAIResponse?: any
  }
} 