import React from "react"

interface CrewAIArtifactProps {
  title: string
  content: string
  createdAt: string
}

export function CrewAIArtifact({ title, content, createdAt }: CrewAIArtifactProps) {
  const displayContent = typeof content === "object"
    ? JSON.stringify(content, null, 2)
    : content
  return (
    <div className="rounded-lg border bg-white p-4 shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">{displayContent}</pre>
    </div>
  )
} 