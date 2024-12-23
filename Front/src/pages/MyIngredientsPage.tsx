// src/pages/MyIngredientsPage.tsx

import React, { useState } from "react";
import IngredientModal from "../features/MyIngredients/IngredientModal";
import RecognitionResultModal from "../features/MyIngredients/RecognitionResultModal";
import LoadingModal from "../components/organisms/LoadingModal";
import IngredientsTable from "../features/MyIngredients/IngredientsTable";
import { usePopupState } from "../hooks/usePopupState";
import { Plus } from "react-bootstrap-icons";
import HomeNavBar from "../components/organisms/HomeNavBar";
import { Ingredient } from "../types/EntityTypes";

const getRandomIngredients = (ingredients: string[], count: number): Ingredient[] => {
  const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((item, index) => ({
    ingredientId: Date.now() + index, // ingredientId를 number로 생성
    name: item,
    quantity: 1,
  }));
};

const MyIngredientsPage: React.FC = () => {
  const ingredientModal = usePopupState<{ selectedFile: File | null }>({ selectedFile: null });
  const recognitionModal = usePopupState<{ resultList: Ingredient[] }>({
    resultList: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [dataFrame, setDataFrame] = useState<Ingredient[]>([]);

  const ingredientList: string[] = [
    "당근", "계란", "마늘", "감자", "생닭고기", "생 소고기", "밥", "고구마", "두부", "토마토",
    "대파", "고등어", "김치", "돼지고기", "양배추", "버섯", "콩나물", "애호박", "고추", "깻잎",
    "시리얼", "김", "라면", "참치캔", "냉동 만두", "베이컨", "시금치", "오이", "게맛살", "삼겹살"
  ];

  const categories = [
    { id: 1, name: "채소" },
    { id: 2, name: "육류" },
    { id: 3, name: "가공식품" },
    { id: 4, name: "발효식품" },
    { id: 5, name: "과일" },
  ];

  const storageMethods = [
    { id: 1, name: "냉장" },
    { id: 2, name: "냉동" },
    { id: 3, name: "상온" },
  ];

  const handleUploadConfirm = () => {
    const { selectedFile } = ingredientModal.state;

    if (!selectedFile) {
      alert("사진을 선택해주세요.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const randomCount = Math.floor(Math.random() * 5) + 4;
      const randomIngredients = getRandomIngredients(ingredientList, randomCount);

      recognitionModal.setState({
        resultList: randomIngredients,
      });

      ingredientModal.close();
      recognitionModal.open();
    }, 3000);
  };

  const handleRecognitionConfirm = (editedIngredients: Ingredient[]) => {
    const combinedData = editedIngredients.map((item) => ({
      ...item,
      ingredientId: Date.now() + Math.random(),
      shelfLife: `${Math.floor(Math.random() * 10) + 1}일`,
      consumeBy: `${Math.floor(Math.random() * 15) + 5}일`,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
      storageMethodId: storageMethods[Math.floor(Math.random() * storageMethods.length)].id,
    }));

    setDataFrame((prev) => [...prev, ...combinedData]);
    recognitionModal.close();
    recognitionModal.reset();
  };

  return (
    <div className="container text-center my-ingredients">
      <h2 className="my-3">나의 식재료</h2>

      {ingredientModal.isOpen && (
        <IngredientModal
          onConfirm={handleUploadConfirm}
          onCancel={ingredientModal.close}
          selectedFile={ingredientModal.state.selectedFile}
          fileChangeHandler={(file) =>
            ingredientModal.setState({ ...ingredientModal.state, selectedFile: file })
          }
        />
      )}

      {recognitionModal.isOpen && (
        <RecognitionResultModal
          resultList={recognitionModal.state.resultList}
          onConfirm={handleRecognitionConfirm}
          onClose={recognitionModal.close}
        />
      )}

      {loading && <LoadingModal />}

      <IngredientsTable
        data={dataFrame}
        onSaveRow={(index, updatedRow) =>
          setDataFrame((prevData) =>
            prevData.map((item, i) => (i === index ? updatedRow : item))
          )
        }
        onDeleteRow={(index) =>
          setDataFrame((prevData) => prevData.filter((_, i) => i !== index))
        }
      />

      <button
        className="btn btn-success position-fixed"
        style={{
          bottom: "80px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
        }}
        onClick={() => {
          ingredientModal.reset();
          ingredientModal.open();
        }}
      >
        <Plus size={28} />
      </button>

      <HomeNavBar />
    </div>
  );
};

export default MyIngredientsPage;
