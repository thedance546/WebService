import React, { useState, useEffect } from 'react';
import IngredientModal from './IngredientModal';
import RecognitionResultModal from './RecognitionResultModal';
import LoadingModal from './LoadingModal';
import { Plus } from 'react-bootstrap-icons';

// 랜덤 식재료 선택 함수
const getRandomIngredients = (ingredients, count) => {
  const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item) => ({ name: item, quantity: 1 }));
};

// JSON 데이터 저장 함수
const saveDataToFile = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'my_ingredients.json';
  link.click();
};

// JSON 데이터 로드 함수
const loadDataFromFile = async () => {
  try {
    const response = await fetch('/Data/my_ingredients.json');
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
};

const MyIngredients = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoType, setPhotoType] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataFrame, setDataFrame] = useState([]);
  const [ingredientList] = useState([
    '당근', '계란', '마늘', '감자', '생닭고기', '생 소고기', '밥', '고구마', '두부', '토마토',
    '대파', '고등어', '김치', '돼지고기', '양배추', '버섯', '콩나물', '애호박', '고추', '깻잎',
    '시리얼', '김', '라면', '참치캔', '냉동 만두', '베이컨', '시금치', '오이', '게맛살', '삼겹살'
  ]);
  const [expiryData, setExpiryData] = useState([]);
  const [infoData, setInfoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const expiryResponse = await fetch('/Data/IngredientsExpiryData.json');
      const infoResponse = await fetch('/Data/IngredientsInfoData.json');
      const savedData = await loadDataFromFile();

      setExpiryData(await expiryResponse.json().then((data) => data.ingredients || []));
      setInfoData(await infoResponse.json().then((data) => data.ingredients || []));
      setDataFrame(savedData);
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? URL.createObjectURL(file) : null);
  };

  const handlePhotoTypeChange = (event) => {
    setPhotoType(event.target.value);
  };

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
    const updatedDataFrame = [...dataFrame, ...combinedData];
    setDataFrame(updatedDataFrame);
    saveDataToFile(updatedDataFrame); // JSON 파일 저장
    setRecognitionResult(null);
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={28} />
      </button>

      {/* 식재료 등록 모달 */}
      {isModalOpen && (
        <IngredientModal
          onConfirm={handleUploadConfirm}
          onCancel={() => setIsModalOpen(false)}
          selectedFile={selectedFile}
          fileChangeHandler={handleFileChange}
          photoType={photoType}
          photoTypeChangeHandler={handlePhotoTypeChange}
        />
      )}

      {/* 인식 결과 모달 */}
      {recognitionResult && (
        <RecognitionResultModal
          result={recognitionResult}
          onConfirm={handleRecognitionConfirm}
          onClose={() => setRecognitionResult(null)}
        />
      )}

      {/* 로딩 모달 */}
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
