import React from "react";
import IngredientCardContainer from "../features/NewIngredients/IngredientCardContainer";
import EditIngredientModal from "../features/NewIngredients/EditIngredientModal";
import IngredientModal from "../features/NewIngredients/IngredientModal";
import RecognitionResultModal from "../features/NewIngredients/RecognitionResultModal";
import LoadingModal from "../components/organisms/LoadingModal";
import { usePopupState } from "../hooks/usePopupState";
import { useIngredients } from "../contexts/IngredientsContext";

const NewIngredientsPage: React.FC = () => {
  const ingredientModal = usePopupState<{ selectedFile: File | null }>({ selectedFile: null });
  const recognitionModal = usePopupState<{ resultList: any[] }>({ resultList: [] });
  const editModal = usePopupState<any | null>(null);
  const { addIngredient, updateIngredient } = useIngredients();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleUploadConfirm = () => {
    const { selectedFile } = ingredientModal.state;

    if (!selectedFile) {
      alert("사진을 선택해주세요.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const mockResponse = [
        { ingredientId: Date.now(), name: "Mock Ingredient", quantity: 1, categoryId: 1, storageMethodId: 1, shelfLife: 7, consumeBy: 14, purchaseDate: "2025-01-01" },
      ];
      recognitionModal.setState({ resultList: mockResponse });
      ingredientModal.close();
      recognitionModal.open();
    }, 3000);
  };

  const handleAddIngredient = (newIngredients: any[]) => {
    addIngredient(newIngredients);
    recognitionModal.close();
  };

  const handleSave = (updatedIngredient: any) => {
    updateIngredient(updatedIngredient);
    editModal.close();
  };

  return (
    <div className="container-fluid px-0" style={{ paddingBottom: "var(--navbar-height)" }}>
      <h2 className="text-center my-4">나의 식재료</h2>

      {/* 식재료 카드 리스트 */}
      <IngredientCardContainer />

      {/* 로딩 모달 */}
      {loading && <LoadingModal />}

      {/* 식재료 추가 모달 */}
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

      {/* 인식 결과 모달 */}
      {recognitionModal.isOpen && (
        <RecognitionResultModal
          resultList={recognitionModal.state.resultList}
          onConfirm={handleAddIngredient}
          onClose={recognitionModal.close}
        />
      )}

      {/* 수정 모달 */}
      {editModal.isOpen && editModal.state && (
        <EditIngredientModal
          row={{
            name: editModal.state.name,
            quantity: editModal.state.quantity,
            category: `카테고리 ID: ${editModal.state.categoryId}`,
            storage: `보관 방법 ID: ${editModal.state.storageMethodId}`,
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
    </div>
  );
};

export default NewIngredientsPage;
