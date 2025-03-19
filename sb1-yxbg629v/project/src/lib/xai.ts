import axios from 'axios';
import { Language, PROMPTS, SYSTEM_MESSAGES } from '../types';

const API_KEY = 'xai-20GObmUB07sCrQZCHVatz0svvRwcbEuTq8O1MXeHMP8ymuX1U5TryUtf4yo9KfMA77JfDCfZNKOaEtx1';
const BASE_URL = 'https://api.x.ai/v1/chat/completions';

function removeAsterisks(text: string): string {
  return text.replace(/\*/g, '').replace(/``/g, '');
}

function countTokens(text: string): number {
  return Math.floor(text.length / 4) + 1;
}

export async function generateScript(title: string, language: Language, onProgress: (step: number, text: string) => void): Promise<void> {
  const prompts = PROMPTS[language];
  const systemMessage = SYSTEM_MESSAGES[language];

  for (let i = 0; i < prompts.length; i++) {
    try {
      const instruction = prompts[i].replace('{title}', title);
      
      const payload = {
        model: 'grok-2',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: instruction }
        ],
        max_tokens: 3000,
        temperature: 0.7,
        stream: false
      };

      const headers = {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(BASE_URL, payload, { headers });
      const text = response.data.choices[0].message.content;
      const cleanText = removeAsterisks(text);
      
      onProgress(i + 1, cleanText);
    } catch (error) {
      console.error(`Error generating section ${i + 1}:`, error);
      onProgress(i + 1, `[Error generating section ${i + 1}]`);
    }
  }
}