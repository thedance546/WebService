// src/context/ChatbotContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ChatbotContextType {
  imageData: string | null;
  setImageData: (data: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [imageData, setImageData] = useState<string | null>(null);

  return (
    <ChatbotContext.Provider value={{ imageData, setImageData }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useImageContext = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useImageContext must be used within a ChatbotProvider');
  }
  return context;
};
