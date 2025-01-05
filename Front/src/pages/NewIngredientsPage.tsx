import React, { useState } from "react";
import HomeNavBar from "../components/organisms/HomeNavBar";
import { Ingredient } from "../types/EntityTypes";
import EditIngredientModal from "../features/MyIngredients/EditIngredientModal";

const EnhancedIngredientsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // 예시 데이터
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredientId: 1, name: "토마토", categoryId: 1, storageMethodId: 1, quantity: 10, shelfLife: 7, consumeBy: 14, purchaseDate: "2025-01-01" },
    { ingredientId: 2, name: "방울 토마토", categoryId: 1, storageMethodId: 1, quantity: 20, shelfLife: 7, consumeBy: 14, purchaseDate: "2025-01-03" },
    { ingredientId: 3, name: "김치", categoryId: 2, storageMethodId: 1, quantity: 5, shelfLife: 30, consumeBy: 180, purchaseDate: "2025-01-01" },
  ]);

  const categories = ["전체", "채소", "가공식품"];

  const filteredIngredients =
    activeTab === "전체"
      ? ingredients
      : ingredients.filter((item) =>
          categories.findIndex((cat) => cat === activeTab) === item.categoryId
        );

  const calculateDDay = (purchaseDate: string, shelfLife: number): string => {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const expiry = new Date(purchase);
    expiry.setDate(purchase.getDate() + shelfLife);

    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  const handleSave = (updatedIngredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.ingredientId === updatedIngredient.ingredientId
          ? updatedIngredient
          : ingredient
      )
    );
    setEditingIngredient(null);
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
            className={`btn btn-${activeTab === category ? "primary" : "outline-primary"} mx-1 mb-2`}
            onClick={() => setActiveTab(category)}
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
        {filteredIngredients.map((ingredient) => (
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
            onClick={() => setEditingIngredient(ingredient)}
          >
            <h5 className="card-title">{ingredient.name}</h5>
            <p>
              <strong>수량:</strong> {ingredient.quantity}
              <br />
              <strong>D-day:</strong> {calculateDDay(ingredient.purchaseDate || "", ingredient.shelfLife || 0)}
            </p>
          </div>
        ))}
      </div>

      {/* 수정 모달 */}
      {editingIngredient && (
        <EditIngredientModal
          row={{
            name: editingIngredient.name,
            quantity: editingIngredient.quantity,
            category: categories[editingIngredient.categoryId || 0],
            storage: `보관 ID: ${editingIngredient.storageMethodId}`,
            purchaseDate: editingIngredient.purchaseDate || "",
          }}
          onSave={(updatedRow) =>
            handleSave({
              ...editingIngredient,
              name: updatedRow.name,
              quantity: updatedRow.quantity,
              categoryId: categories.findIndex((cat) => cat === updatedRow.category),
              storageMethodId: parseInt(updatedRow.storage.split(":")[1]) || 1,
              purchaseDate: updatedRow.purchaseDate,
            })
          }
          onCancel={() => setEditingIngredient(null)}
        />
      )}
      <HomeNavBar />
    </div>
  );
};

export default EnhancedIngredientsPage;
