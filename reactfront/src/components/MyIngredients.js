// MyIngredients.js
import React, { useState } from 'react';
import './MyIngredients.css';

const MyIngredients = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoType, setPhotoType] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? URL.createObjectURL(file) : null);
  };

  const handlePhotoTypeChange = (event) => {
    setPhotoType(event.target.value);
  };

  const handleUploadCancel = () => {
    setSelectedFile(null);
    setPhotoType('');
    setShowModal(false);
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile || !photoType) {
      alert('사진과 타입을 선택해주세요.');
      return;
    }

    setLoading(true);

    // API 통신 모의 코드
    setTimeout(() => {
      setLoading(false);
      setRecognitionResult({
        resultImage: selectedFile,
        resultList: ['사과', '오렌지', '바나나'], // AI 모델 결과 모의
      });
    }, 3000);
  };

  const handleResultModalClose = () => {
    setRecognitionResult(null);
    setShowModal(false);
  };

  return (
    <div className="my-ingredients">
      <h2>나의 식자재</h2>

      {/* 초록색 원형 버튼 */}
      <button className="upload-button" onClick={() => setShowModal(true)}>
        +
      </button>

      {/* 업로드 모달 */}
      {showModal && !recognitionResult && (
        <div className="modal">
          <div className="modal-content">
            <h3>사진 업로드</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {selectedFile && (
              <div className="preview-container">
                <img src={selectedFile} alt="미리보기" className="preview-image" />
              </div>
            )}

            <div className="photo-type-options">
              <label>
                <input
                  type="radio"
                  name="photoType"
                  value="영수증 인식"
                  onChange={handlePhotoTypeChange}
                />
                영수증 인식
              </label>
              <label>
                <input
                  type="radio"
                  name="photoType"
                  value="구매내역 캡쳐"
                  onChange={handlePhotoTypeChange}
                />
                구매내역 캡쳐
              </label>
              <label>
                <input
                  type="radio"
                  name="photoType"
                  value="물체 인식"
                  onChange={handlePhotoTypeChange}
                />
                물체 인식
              </label>
            </div>

            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleUploadConfirm}>
                확인
              </button>
              <button className="cancel-button" onClick={handleUploadCancel}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결과 모달 */}
      {recognitionResult && (
        <div className="modal">
          <div className="modal-content">
            <h3>인식 결과</h3>
            <div className="preview-container">
              <img src={recognitionResult.resultImage} alt="결과 이미지" className="preview-image" />
            </div>
            <ul className="result-list">
              {recognitionResult.resultList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleResultModalClose}>
                확인
              </button>
              <button className="cancel-button" onClick={handleResultModalClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로딩 중 */}
      {loading && (
        <div className="modal">
          <div className="modal-content">
            <h3>처리 중...</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIngredients;
