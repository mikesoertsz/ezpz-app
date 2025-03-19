import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI with environment variable and fallback
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

// Initialize Anthropic with environment variable and fallback
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `You are an expert AI assistant specializing in creating recruitment workflow diagrams. Your task is to generate a JSON structure that represents a recruitment flow based on user requirements.

The flow should follow these guidelines:
1. Start with a START node
2. Include relevant recruitment steps like application review, interviews, assessments
3. Use decision nodes for branching paths
4. Include communication nodes (email, calls) where appropriate
5. End with an END node
6. Each node should have meaningful labels and descriptions
7. Return only valid JSON that matches the expected schema

The response should be a JSON object with this structure:
{
  "nodes": [
    {
      "id": string,
      "type": "recruitmentNode",
      "position": { "x": number, "y": number },
      "data": {
        "type": string (one of: "start", "end", "collect_data", "send_email", "send_whatsapp", "make_call", "review_application", "decision", "notification"),
        "label": string,
        "description": string,
        "params": object (specific parameters for each node type)
      }
    }
  ],
  "edges": [
    {
      "id": string,
      "source": string (node id),
      "target": string (node id),
      "type": "smoothstep",
      "animated": true
    }
  ]
}`;

export const aiService = {
  async generateFlow(prompt: string): Promise<{ nodes: any[], edges: any[] }> {
    // Check if either API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY && !import.meta.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('No AI API keys configured. Please add either VITE_OPENAI_API_KEY or VITE_ANTHROPIC_API_KEY to your environment variables.');
    }

    try {
      // Try OpenAI first if key is available
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
          });

          const result = JSON.parse(completion.choices[0].message.content);
          return result;
        } catch (openaiError) {
          console.warn('OpenAI failed:', openaiError);
          // If Anthropic key is available, try it as fallback
          if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
            console.log('Falling back to Anthropic');
            throw openaiError; // Propagate to fallback
          }
          // If no Anthropic key, rethrow
          throw openaiError;
        }
      }
      
      // Try Anthropic if OpenAI failed or wasn't available
      if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
        const message = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 4096,
          messages: [
            { role: "user", content: `${SYSTEM_PROMPT}\n\nUser request: ${prompt}` }
          ],
          system: "You are an expert recruitment workflow designer. Generate JSON that matches the specified schema exactly."
        });

        const result = JSON.parse(message.content[0].text);
        return result;
      }

      throw new Error('No AI service available');
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate flow. Please check your API keys and try again.');
    }
  }
};