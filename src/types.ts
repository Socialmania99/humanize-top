export type ToolType = 
  | 'humanizer' 
  | 'detector' 
  | 'paraphraser' 
  | 'grammar' 
  | 'plagiarism' 
  | 'chat' 
  | 'translator' 
  | 'summarizer' 
  | 'writer';

export interface HistoryItem {
  id: number;
  user_email: string;
  original_text: string;
  humanized_text: string;
  score: number;
  type: string;
  created_at: string;
}

export interface User {
  email: string;
  credits: number;
}

export interface DetectionResult {
  score: number;
  segments: { text: string; aiProbability: number }[];
  wordCount: number;
  charCount: number;
}

export interface HumanizationResult {
  casual: string;
  professional: string;
  narrative: string;
}
