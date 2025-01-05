// src/types/FeatureTypes.ts

export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  sender: Sender;
  text: string;
  imageUrl?: string;
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
    activityLevel: string;
    healthGoal: string;
    allergies: string[];
    mealTimes: string[];
    foodCategories: string[];
    customFoodCategory: string;
    customAllergy: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export interface IngredientRow {
  name: string;
  quantity: number;
  category: string;
  storage: string;
  purchaseDate: string;
}

export interface EditIngredientModalProps {
  row: IngredientRow;
  onSave: (row: IngredientRow) => void;
  onCancel: () => void;
}