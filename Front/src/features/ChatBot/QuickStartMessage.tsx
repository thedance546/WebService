// src/features/ChatBot/QuickStartMessage.tsx

import React from 'react';
import Button from '../../components/atoms/Button';

interface QuickStartMessageProps {
  onQuickAction: (action: string) => void;
}

const QuickStartMessage: React.FC<QuickStartMessageProps> = ({ onQuickAction }) => {
  const quickActions = [
    { label: '레시피 추천', action: 'recommend_recipe' },
    { label: '정보 입력', action: 'input_info' },
  ];

  return (
    <div className="quick-actions">
      {quickActions.map((item, index) => (
        <Button
          key={index}
          onClick={() => onQuickAction(item.action)}
          variant="primary"
          className="me-2 mb-2"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickStartMessage;
