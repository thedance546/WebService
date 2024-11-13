// Settings.js
import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [isTeamInfoOpen, setIsTeamInfoOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const toggleTeamInfo = () => setIsTeamInfoOpen(!isTeamInfoOpen);
  const togglePrivacyPolicy = () => setIsPrivacyPolicyOpen(!isPrivacyPolicyOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  const handleContactMessageChange = (e) => setContactMessage(e.target.value);

  const handleLogout = () => {
    // 로그아웃 로직을 구현
    alert('로그아웃 되었습니다.');
  };

  const handleDeleteAccount = () => {
    // 회원탈퇴 로직을 구현
    alert('회원탈퇴 되었습니다.');
  };

  return (
    <div className="settings-content">
      <h2>설정</h2>

      {/* 개발팀 정보 버튼 */}
      <button onClick={toggleTeamInfo}>개발팀 정보 보기</button>
      {isTeamInfoOpen && (
        <div className="content-section no-scroll">
          <h3>개발팀 정보</h3>
          <p>이름: 홍길동</p>
          <p>이메일: devteam@example.com</p>
        </div>
      )}

      {/* 개인정보 처리방침 버튼 */}
      <button onClick={togglePrivacyPolicy}>개인정보 처리방침 보기</button>
      {isPrivacyPolicyOpen && (
        <div className="content-section scrollable">
          <h3>개인정보 처리방침</h3>
          <p>여기에 개인정보 처리방침 내용이 표시됩니다...</p>
        </div>
      )}

      {/* 개발자 문의 버튼 */}
      <button onClick={toggleContact}>개발자에게 문의하기</button>
      {isContactOpen && (
        <div className="content-section">
          <h3>개발자에게 문의</h3>
          <input
            type="text"
            className="input-box"
            placeholder="문의 내용을 입력하세요."
            value={contactMessage}
            onChange={handleContactMessageChange}
          />
          <button className="send-button">보내기</button>
        </div>
      )}

      {/* 로그아웃 및 회원탈퇴 버튼 */}
      <div className="account-actions">
        <button onClick={handleLogout} className="logout-button">로그아웃</button>
        <button onClick={handleDeleteAccount} className="delete-account-button">회원탈퇴</button>
      </div>
    </div>
  );
};

export default Settings;
