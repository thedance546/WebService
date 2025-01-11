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
  formatted?: boolean;
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

export interface OrderItem {
  itemName: string;
  count: number;
  category?: string; // 직접 추가에서만 사용
  storageMethod?: string; // 직접 추가에서만 사용
  sellByDays?: number; // 직접 추가에서만 사용
  useByDays?: number; // 직접 추가에서만 사용
}

export interface OrderRequest {
  orderDate: string;
  orderItems: OrderItem[];
}