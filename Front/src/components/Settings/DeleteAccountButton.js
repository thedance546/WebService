// src/components/Settings/DeleteAccountButton.js
import React, { useState } from 'react';
import api from '../../services/Api';

const DeleteAccountButton = ({ onAccountDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken'); // Authorization 헤더에 토큰 포함
      await api.delete('/api/auth/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      if (onAccountDeleted) onAccountDeleted(); // 회원 탈퇴 후 콜백 실행
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      alert('회원 탈퇴 중 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeleteAccount}
      className="btn btn-danger"
      disabled={loading}
    >
      {loading ? '탈퇴 진행 중...' : '회원탈퇴'}
    </button>
  );
};

export default DeleteAccountButton;
