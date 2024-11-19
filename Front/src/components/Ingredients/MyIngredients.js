import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';
import { useModalState } from '../../hooks/useModalState';
import { Plus } from 'react-bootstrap-icons';

const getRandomIngredients = (ingredients, count) => {
  const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item) => ({ name: item, quantity: 1 }));
};

const MyIngredients = () => {
  const ingredientModal = useModalState(); // IngredientModal 상태 관리
  const recognitionModal = useModalState(); // RecognitionResultModal 상태 관리

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // IngredientModal에서 사용할 상태
  const [photoType, setPhotoType] = useState(''); // IngredientModal에서 사용할 상태
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [dataFrame, setDataFrame] = useState([]);
  const [expiryData, setExpiryData] = useState([]);
  const [infoData, setInfoData] = useState([]);
  const ingredientList = [
    '당근', '계란', '마늘', '감자', '생닭고기', '생 소고기', '밥', '고구마', '두부', '토마토',
    '대파', '고등어', '김치', '돼지고기', '양배추', '버섯', '콩나물', '애호박', '고추', '깻잎',
    '시리얼', '김', '라면', '참치캔', '냉동 만두', '베이컨', '시금치', '오이', '게맛살', '삼겹살'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const expiryResponse = await fetch('/Data/IngredientsExpiryData.json');
      const infoResponse = await fetch('/Data/IngredientsInfoData.json');

      setExpiryData(await expiryResponse.json().then((data) => data.ingredients || []));
      setInfoData(await infoResponse.json().then((data) => data.ingredients || []));
    };

    fetchData();
  }, []);

  const handleUploadConfirm = () => {
    if (!selectedFile || !photoType) {
      alert('사진과 이미지 타입을 선택해주세요.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const randomCount = Math.floor(Math.random() * 5) + 1;
      const randomIngredients = getRandomIngredients(ingredientList, randomCount);
      setRecognitionResult({ resultImage: selectedFile, resultList: randomIngredients });

      // 상태 초기화
      setSelectedFile(null);
      setPhotoType('');
      ingredientModal.close();
    }, 3000);
  };

  const handleRecognitionConfirm = (editedIngredients) => {
    const combinedData = editedIngredients.map((item) => {
      const expiryInfo = expiryData.find((exp) => exp.name === item.name) || {};
      const info = infoData.find((info) => info.name === item.name) || {};
      return {
        ...item,
        shelfLife: expiryInfo.shelf_life || '정보 없음',
        consumeBy: expiryInfo.consume_by || '정보 없음',
        category: info.category || '정보 없음',
        storage: info.storage || '정보 없음',
      };
    });
    setDataFrame((prev) => [...prev, ...combinedData]);
    recognitionModal.close();
  };

  return (
    <div className="container text-center my-ingredients">
      <h2 className="my-3">나의 식재료</h2>

      {/* 추가 버튼 */}
      <button
        className="btn btn-success position-fixed"
        style={{
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
        }}
        onClick={ingredientModal.open}
      >
        <Plus size={28} />
      </button>

      {/* IngredientModal */}
      {ingredientModal.isOpen && (
        <IngredientModal
          onConfirm={handleUploadConfirm}
          onCancel={ingredientModal.close}
          selectedFile={selectedFile}
          fileChangeHandler={(e) =>
            setSelectedFile(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null)
          }
          photoType={photoType}
          photoTypeChangeHandler={(e) => setPhotoType(e.target.value)}
        />
      )}

      {/* RecognitionResultModal */}
      {recognitionModal.isOpen && (
        <RecognitionResultModal
          result={recognitionResult}
          onConfirm={handleRecognitionConfirm}
          onClose={recognitionModal.close}
        />
      )}

      {/* LoadingModal */}
      {loading && <LoadingModal />}

      {/* 데이터프레임 테이블 */}
      {dataFrame.length > 0 && (
        <table className="table mt-5">
          <thead>
            <tr>
              <th>이름</th>
              <th>수량</th>
              <th>유통기한</th>
              <th>소비 기한</th>
              <th>카테고리</th>
              <th>저장 방식</th>
            </tr>
          </thead>
          <tbody>
            {dataFrame.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.quantity}</td>
                <td>{row.shelfLife}</td>
                <td>{row.consumeBy}</td>
                <td>{row.category}</td>
                <td>{row.storage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyIngredients;
