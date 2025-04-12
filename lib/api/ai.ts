import { analyzeArgument, generateDebateResponse, generateDebateFeedback } from "@/lib/services/cerebras"

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

// API functions
export async function analyzeArgumentAPI(text: string): Promise<ArgumentAnalysis> {
  try {
    const startTime = performance.now();
    const analysis = await analyzeArgument(text);
    const endTime = performance.now();
    
    return {
      ...analysis,
      latency: (endTime - startTime) / 1000
    };
  } catch (error) {
    console.error('Error analyzing argument:', error);
    throw error;
  }
}

export async function generateDebateResponseAPI(messages: DebateMessage[]): Promise<string> {
  try {
    return await generateDebateResponse(messages);
  } catch (error) {
    console.error('Error generating debate response:', error);
    throw error;
  }
}

export async function generateDebateFeedbackAPI(transcript: string): Promise<string> {
  try {
    return await generateDebateFeedback(transcript);
  } catch (error) {
    console.error('Error generating debate feedback:', error);
    throw error;
  }
} 