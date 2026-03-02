import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export const geminiModel = "gemini-3-flash-preview";

export async function detectAI(text: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Analyze the following text for AI-generated patterns. 
    Provide an overall AI probability score (0-100) and break the text into segments, 
    identifying which parts feel most like AI.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall AI probability score (0-100)" },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                aiProbability: { type: Type.NUMBER, description: "Probability this segment is AI (0-100)" }
              },
              required: ["text", "aiProbability"]
            }
          }
        },
        required: ["score", "segments"]
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
}

export async function humanizeText(text: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Transform the following text into three distinct human-sounding versions: 
    1. Casual (conversational, relatable)
    2. Professional (clear, authoritative, polished)
    3. Narrative (story-like, engaging, descriptive)
    
    The goal is to bypass AI detectors while maintaining the original meaning.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          casual: { type: Type.STRING },
          professional: { type: Type.STRING },
          narrative: { type: Type.STRING }
        },
        required: ["casual", "professional", "narrative"]
      }
    }
  });
  
  return JSON.parse(response.text || "{}");
}

export async function paraphraseText(text: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Rewrite the following text while maintaining the original meaning using advanced synonym mapping and structural changes.
    
    Text: "${text}"`,
  });
  return response.text;
}

export async function checkGrammar(text: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Correct the grammar, spelling, and punctuation of the following text. 
    Return the corrected text and a list of changes made.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: { type: Type.STRING },
          changes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["correctedText", "changes"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}

export async function summarizeText(text: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Condense the following text into key bullet points.
    
    Text: "${text}"`,
  });
  return response.text;
}

export async function translateText(text: string, targetLanguage: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Translate the following text to ${targetLanguage}.
    
    Text: "${text}"`,
  });
  return response.text;
}

export async function generateDraft(prompt: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Write a creative draft based on this prompt: "${prompt}". 
    After writing the draft, automatically humanize it to sound natural and engaging.`,
  });
  return response.text;
}

export async function chatWithAI(message: string, history: { role: string, parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: geminiModel,
    config: {
      systemInstruction: "You are Humanize Top Assistant, a helpful AI expert in content creation and humanization.",
    },
    history: history
  });
  
  const response = await chat.sendMessage({ message });
  return response.text;
}
