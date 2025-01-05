// src/pages/NewIngredientsPage.tsx

import React, { useState } from "react";
import HomeNavBar from "../components/organisms/HomeNavBar";
import { Ingredient } from "../types/EntityTypes";
import EditIngredientModal from "../features/MyIngredients/EditIngredientModal";
import IngredientModal from "../features/MyIngredients/IngredientModal";
import { usePopupState } from "../hooks/usePopupState";

const NewIngredientsPage: React.FC = () => {
  const ingredientModal = usePopupState<{ selectedFile: File | null }>({ selectedFile: null });
  const editModal = usePopupState<Ingredient | null>(null);

  // 예시 데이터
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredientId: 1, name: "토마토", categoryId: 1, storageMethodId: 1, quantity: 10, shelfLife: 7, consumeBy: 14, purchaseDate: "2025-01-01" },
    { ingredientId: 2, name: "방울 토마토", categoryId: 1, storageMethodId: 1, quantity: 20, shelfLife: 7, consumeBy: 14, purchaseDate: "2025-01-03" },
    { ingredientId: 3, name: "김치", categoryId: 2, storageMethodId: 1, quantity: 5, shelfLife: 30, consumeBy: 180, purchaseDate: "2025-01-01" },
  ]);

  const categories = ["전체", "채소", "가공식품"];

  const handleAddIngredient = (newIngredients: Ingredient[]) => {
    setIngredients((prev) => [...prev, ...newIngredients]);
    ingredientModal.close();
  };

  const handleSave = (updatedIngredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.ingredientId === updatedIngredient.ingredientId
          ? updatedIngredient
          : ingredient
      )
    );
    editModal.close();
  };

  return (
    <div
      className="container-fluid px-0"
      style={{
        paddingBottom: "var(--navbar-height)", // HomeNavBar 높이만큼 공간 확보
      }}
    >
      <h2 className="text-center my-4">나의 식재료</h2>

      {/* 상단 탭 */}
      <div className="d-flex justify-content-center mb-4 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn btn-${category === "전체" ? "primary" : "outline-primary"} mx-1 mb-2`}
            onClick={() => {}}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 반응형 그리드 레이아웃 */}
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* 등록 버튼 */}
        <div
          className="card text-center"
          style={{
            padding: "1rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            cursor: "pointer",
            color: "green",
            fontWeight: "bold",
          }}
          onClick={() => ingredientModal.open()}
        >
          + 식재료 등록
        </div>

        {/* 데이터 카드 */}
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.ingredientId}
            className="card"
            style={{
              padding: "1rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => editModal.setState(ingredient)}
          >
            <h5 className="card-title">{ingredient.name}</h5>
            <p>
              <strong>수량:</strong> {ingredient.quantity}
              <br />
              <strong>D-day:</strong> {ingredient.purchaseDate}
            </p>
          </div>
        ))}
      </div>

      {/* 등록 모달 */}
      {ingredientModal.isOpen && (
        <IngredientModal
          onConfirm={(file) => {
            handleAddIngredient([
              {
                ingredientId: Date.now(),
                name: "등록된 식재료",
                categoryId: 1,
                storageMethodId: 1,
                quantity: 1,
                shelfLife: 7,
                consumeBy: 14,
                purchaseDate: new Date().toISOString().split("T")[0],
              },
            ]);
          }}
          onCancel={ingredientModal.close}
          selectedFile={ingredientModal.state.selectedFile}
          fileChangeHandler={(file) =>
            ingredientModal.setState({ ...ingredientModal.state, selectedFile: file })
          }
        />
      )}

      {/* 수정 모달 */}
      {editModal.isOpen && editModal.state && (
        <EditIngredientModal
          row={{
            name: editModal.state.name,
            quantity: editModal.state.quantity,
            category: categories[editModal.state.categoryId || 0],
            storage: `보관 ID: ${editModal.state.storageMethodId}`,
            purchaseDate: editModal.state.purchaseDate || "",
          }}
          onSave={(updatedRow) =>
            handleSave({
              ...editModal.state!,
              name: updatedRow.name,
              quantity: updatedRow.quantity,
              purchaseDate: updatedRow.purchaseDate,
            })
          }
          onCancel={editModal.close}
        />
      )}

      <HomeNavBar />
    </div>
  );
};

export default NewIngredientsPage;
