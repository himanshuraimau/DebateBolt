import { analyzeArgument, generateDebateResponse, generateDebateFeedback } from "@/lib/services/cerebras"
import { useQuery, useMutation } from "@tanstack/react-query"

// Types
export type ArgumentAnalysis = {
  score: number
  feedback: string
  rebuttals: string[]
  deliveryTips: string
  latency: number
}

export type DebateMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

// Query keys
export const aiKeys = {
  all: ["ai"] as const,
  analysis: (text: string) => [...aiKeys.all, "analysis", text] as const,
  debate: (messages: DebateMessage[]) => [...aiKeys.all, "debate", messages] as const,
  feedback: (transcript: string) => [...aiKeys.all, "feedback", transcript] as const,
}

// API functions
export const analyzeArgumentAPI = async (text: string): Promise<ArgumentAnalysis> => {
  const startTime = performance.now()
  const analysis = await analyzeArgument(text)
  const endTime = performance.now()
  
  return {
    ...analysis,
    latency: (endTime - startTime) / 1000
  }
}

export const generateDebateResponseAPI = async (messages: DebateMessage[]): Promise<string> => {
  return generateDebateResponse(messages)
}

export const generateDebateFeedbackAPI = async (transcript: string): Promise<string> => {
  return generateDebateFeedback(transcript)
}

// React Query hooks
export function useArgumentAnalysis(text: string) {
  return useQuery({
    queryKey: aiKeys.analysis(text),
    queryFn: () => analyzeArgumentAPI(text),
    enabled: !!text,
    staleTime: 0,
    cacheTime: 0,
  })
}

export function useDebateResponse(messages: DebateMessage[]) {
  return useMutation({
    mutationFn: generateDebateResponseAPI,
  })
}

export function useDebateFeedback(transcript: string) {
  return useQuery({
    queryKey: aiKeys.feedback(transcript),
    queryFn: () => generateDebateFeedbackAPI(transcript),
    enabled: !!transcript,
    staleTime: 0,
    cacheTime: 0,
  })
} 