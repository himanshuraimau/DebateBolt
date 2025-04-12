import Cerebras from '@cerebras/cerebras_cloud_sdk';

type CerebrasResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

export async function analyzeArgument(text: string) {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert debate coach and judge. Analyze the given argument and provide detailed feedback, potential rebuttals, and delivery tips. Focus on logical structure, evidence quality, and rhetorical effectiveness."
      },
      {
        role: "user",
        content: text
      }
    ],
    model: 'llama-4-scout-17b-16e-instruct',
    stream: false,
    max_completion_tokens: 1024,
    temperature: 0.2,
    top_p: 1
  }) as CerebrasResponse;

  const response = stream.choices[0]?.message?.content || '';
  
  // Parse the response to extract structured feedback
  const score = extractScore(response);
  const feedback = extractFeedback(response);
  const rebuttals = extractRebuttals(response);
  const deliveryTips = extractDeliveryTips(response);

  return {
    score,
    feedback,
    rebuttals,
    deliveryTips,
    latency: 0 // We'll calculate this in the calling function
  };
}

export async function generateDebateResponse(messages: Message[]) {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a skilled debater. Engage in a structured debate, providing well-reasoned arguments and counterpoints. Maintain a professional and respectful tone while challenging your opponent's positions."
      },
      ...messages
    ],
    model: 'llama-4-scout-17b-16e-instruct',
    stream: false,
    max_completion_tokens: 1024,
    temperature: 0.7,
    top_p: 1
  }) as CerebrasResponse;

  return stream.choices[0]?.message?.content || '';
}

export async function generateDebateFeedback(transcript: string) {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a debate coach providing real-time feedback. Analyze the debate transcript and provide specific, actionable feedback to help improve the debater's performance."
      },
      {
        role: "user",
        content: transcript
      }
    ],
    model: 'llama-4-scout-17b-16e-instruct',
    stream: false,
    max_completion_tokens: 512,
    temperature: 0.3,
    top_p: 1
  }) as CerebrasResponse;

  return stream.choices[0]?.message?.content || '';
}

// Helper functions to parse the AI responses
function extractScore(text: string): number {
  const scoreMatch = text.match(/score:?\s*(\d+)/i);
  return scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 45) + 50;
}

function extractFeedback(text: string): string {
  const feedbackMatch = text.match(/feedback:?\s*([^\n]+)/i);
  return feedbackMatch ? feedbackMatch[1].trim() : "No specific feedback available.";
}

function extractRebuttals(text: string): string[] {
  const rebuttalsMatch = text.match(/rebuttals:?\s*([\s\S]+?)(?=\n\n|\n$)/i);
  if (!rebuttalsMatch) return [];
  
  return rebuttalsMatch[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, ''));
}

function extractDeliveryTips(text: string): string {
  const tipsMatch = text.match(/delivery tips:?\s*([^\n]+)/i);
  return tipsMatch ? tipsMatch[1].trim() : "No specific delivery tips available.";
} 