// src/types/FeatureTypes.ts

export interface DetectionResult {
  objects: { name: string; confidence: number }[];
}

export interface Message {
  sender: string;
  text: string;
}

export interface ChatMessagesProps {
  messages: Message[];
}