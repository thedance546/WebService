// src/types/FeatureTypes.ts

export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  sender: Sender;
  text: string;
  profileImage?: string;
  attachedImage?: string;
}

export interface ChatMessagesProps {
  messages: Message[];
}

export interface ChatInputProps {
  addMessage: (message: Message) => void;
  toggleOptions: () => void;
  disabled: boolean;
}

export interface UserInfoFormProps {
  formData: {
    ageGroup: string;
    gender: string;
    healthGoal: string;
    mealTimes: string[];
    foodCategories: string[];
    customFoodCategory: string;
    allergies: string[];
    customAllergy: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}