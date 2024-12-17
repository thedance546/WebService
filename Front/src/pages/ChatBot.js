// src/pages/ChatBot.js
import React, { useState, useEffect } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import HomeNavBar from "../components/organisms/HomeNavBar";
import RecipeCard from '../features/ChatBot/RecipeCard';

const DEFAULT_MESSAGE = [
  { text: "안녕하세요! 저는 여러분의 주방 파트너, 레시피 챗봇이에요! 🥄🍲", sender: "bot" },
  { text: "원하는 요리를 말씀해주세요. 냉장고에 있는 재료들로 가능한 레시피부터 특별한 날을 위한 요리까지 추천해 드릴게요!", sender: "bot" },
  { text: "식재료 사진을 올리시면, YOLO 모델이 재료를 인식해서 해당 재료를 활용한 레시피도 제공해 드려요. 무엇이든 편하게 물어보세요! 함께 맛있는 요리를 만들어 봐요! 😊", sender: "bot" }
];

const SAMPLE_RECIPE = {
  title: '어묵 볶음 레시피',
  description: '다음과 같은 간단한 재료들, 당근, 양파, 어묵을 사용해 맛있고 빠르게 만들 수 있는 요리를 추천드립니다.',
  servingSize: '2인분',
  ingredients: [
    '어묵: 200g',
    '당근: 1개 (작게 채썰기)',
    '양파: 1개 (채썰기)',
    '식용유: 2큰술',
    '간장: 2큰술',
    '설탕: 1큰술',
    '다진 마늘: 1작은술',
    '참기름: 1작은술',
    '깨: 약간',
    '물: 2큰술',
    '고추 (선택 사항): 청양고추나 홍고추 슬라이스'
  ],
  steps: [
    '어묵은 먹기 좋은 크기로 자르고, 당근과 양파는 얇게 채썰어 준비합니다.',
    '팬에 식용유를 두르고 다진 마늘을 넣어 향을 낸 후, 당근과 양파를 중불에서 볶아줍니다.',
    '어묵을 넣고 물을 약간 추가한 후 2분간 볶아줍니다.',
    '간장과 설탕을 넣어 잘 섞이도록 볶아줍니다.',
    '참기름을 두르고 불을 끈 뒤, 깨와 고추를 뿌려 마무리합니다.'
  ],
  tips: [
    '어묵 대신 닭가슴살이나 두부를 사용해도 훌륭한 대체가 됩니다.',
    '매콤한 맛을 좋아하면 고춧가루를 추가해 보세요.',
    '남은 재료는 다음 날 볶음밥이나 덮밥으로 활용 가능합니다.'
  ],
  nonAlcoholicDrink: '보리차 또는 자스민차',
  alcoholicDrink: '담백한 맛의 막걸리 또는 화이트 와인',
  nutrition: {
    '칼로리': '약 250kcal',
    '단백질': '8g',
    '지방': '10g',
    '탄수화물': '30g'
  }
};

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : DEFAULT_MESSAGE;
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // 동적 뷰포트 높이 설정 함수
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--viewport-height', `${vh * 100}px`);
  };

  useEffect(() => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages(DEFAULT_MESSAGE);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });
  };

  const handleBotImageUpload = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addMessage({ sender: 'bot', imageUrl });
    }
  };

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const options = [
    { label: '재료 사진 업로드', icon: '📷', action: () => document.getElementById('file-upload').click() },
    { label: '채팅 내역 지우기', icon: '🗑️', action: clearMessages },
    { label: '봇 사진 업로드', icon: '🤖📷', action: () => document.getElementById('bot-file-upload').click() },
  ];

  return (
    <div className="chatbot-container" style={{ overflow: 'auto', paddingBottom: '70px', paddingTop: '20px' }}>
      <div style={{ height: 'var(--top-margin)' }}></div>

      {/* 채팅 메시지 표시 */}
      <ChatMessages messages={messages} style={{ height: 'var(--chat-height)', overflowY: 'auto' }} />

      {/* 레시피 카드 표시 */}
      <div className="recipe-card-wrapper" style={{ marginBottom: '20px' }}>
        <RecipeCard recipe={SAMPLE_RECIPE} />
      </div>

      {/* 파일 업로드 인풋 (숨김 처리) */}
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) handleImageUpload(e.target.files[0]);
        }}
      />

      {/* 봇 파일 업로드 인풋 (숨김 처리) */}
      <input
        type="file"
        id="bot-file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) handleBotImageUpload(e.target.files[0]);
        }}
      />

      {/* 입력창 컴포넌트 */}
      <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} disabled={isOptionsOpen} />

      {/* 옵션 모달 */}
      <OptionsModal isOpen={isOptionsOpen} onClose={toggleOptions} options={options} />

      <HomeNavBar />
    </div>
  );
};

export default ChatBot;
