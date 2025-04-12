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
  apiKey: "csk-t8c35fvhc53w8jpv4w32eed5tfmkke5cjdd62kj3khpvrejv"
});

export async function analyzeArgument(text: string) {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert debate coach and judge. Analyze the given argument and provide detailed feedback in the following structured format:

Analysis:
- Evaluate the argument's logical structure, evidence quality, and rhetorical effectiveness
- Identify strengths and weaknesses
- Provide specific examples from the text

Score:
- Rate the argument on a scale of 0-100
- Consider: logic (30%), evidence (30%), clarity (20%), persuasiveness (20%)

Potential Rebuttals:
- List 3-5 potential counterarguments
- Focus on logical gaps or weak points
- Suggest how to strengthen these areas

Delivery Tips:
- Provide specific suggestions for improvement
- Focus on both content and presentation
- Include practical advice for future debates

Format your response as a JSON object with these exact keys:
{
  "score": number,
  "feedback": string,
  "rebuttals": string[],
  "deliveryTips": string
}`
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

  try {
    const response = stream.choices[0]?.message?.content || '';
    return JSON.parse(response);
  } catch (err) {
    console.error('Error parsing AI response:', err);
    return {
      score: 50,
      feedback: "Unable to analyze the argument at this time.",
      rebuttals: [],
      deliveryTips: "Please try again with a different argument."
    };
  }
}

export async function generateDebateResponse(messages: Message[]) {
  const stream = await cerebras.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a skilled debater engaging in a structured debate. Follow these guidelines:

1. Maintain a professional and respectful tone
2. Address your opponent's points directly
3. Support arguments with logical reasoning and evidence
4. Use clear and concise language
5. Structure your response with:
   - Acknowledgment of previous points
   - Your main argument
   - Supporting evidence
   - Conclusion

Remember to:
- Stay focused on the debate topic
- Use appropriate debate terminology
- Challenge weak points constructively
- Maintain logical consistency`
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