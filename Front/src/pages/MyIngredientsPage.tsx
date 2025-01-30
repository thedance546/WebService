// src/pages/MyIngredientsPage.tsx

import React from "react";
import CommonHeader from "../components/organisms/CommonHeader";
import IngredientCardContainer from "../features/MyIngredients/IngredientCardContainer";
import IngredientDetailsModal from "../features/MyIngredients/IngredientDetailsModal";
import ReceiptUploadModal from "../features/MyIngredients/ReceiptUploadModal";
import AddIngredientModal from "../features/MyIngredients/AddIngredientModal";
import IngredientOptionsModal from "../features/MyIngredients/IngredientOptionModal";
import AddManualIngredientModal from "../features/MyIngredients/AddManualIngredientModal";
import LoadingModal from "../components/organisms/LoadingModal";
import HomeNavBar from '../components/organisms/HomeNavBar';
import { usePopupState } from "../hooks/usePopupState";
import { useIngredients } from "../contexts/IngredientsContext";
import { Ingredient } from "../types/EntityTypes";
import { recognizeReceipt } from "../services/ServiceApi";

const MyIngredientsPage: React.FC = () => {
  const optionsModal = usePopupState(null);
  const receiptUploadModal = usePopupState<{ selectedFile: File | null }>({ selectedFile: null });
  const addIngredientModal = usePopupState<{
    purchaseDate: string;
    matchedItems: string[];
  }>({
    purchaseDate: '',
    matchedItems: [],
  });
  const manualModal = usePopupState(null);
  const detailModal = usePopupState<Ingredient | null>(null);
  const { updateIngredient } = useIngredients();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleReceiptUploadConfirm = async () => {
    const { selectedFile } = receiptUploadModal.state;

    if (!selectedFile) {
      alert("영수증 이미지를 업로드하세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await recognizeReceipt(selectedFile);

      addIngredientModal.setState({
        purchaseDate: response.purchaseDate || "알 수 없음",
        matchedItems: response.matchedItems || [],
      });

      receiptUploadModal.close();
      addIngredientModal.open();
    } catch (error) {
      console.error("영수증 인식 실패:", error);
      alert("영수증 인식에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectInput = () => {
    manualModal.open();
    optionsModal.close();
  };

  return (
    <div className="container">
      <CommonHeader pageTitle="나의 식재료" />

      {/* 식재료 카드 리스트 */}
      <IngredientCardContainer
        onAddClick={optionsModal.open}
        onCardClick={(ingredient) => {
          detailModal.setState(ingredient);
          detailModal.open();
        }}
      />

      {/* 식재료 추가 방법 모달 */}
      {optionsModal.isOpen && (
        <IngredientOptionsModal
          isOpen={optionsModal.isOpen}
          onClose={optionsModal.close}
          openReceiptInputModal={receiptUploadModal.open}
          openManualInputModal={handleDirectInput}
        />
      )}

      {/* 영수증 업로드 모달 */}
      {receiptUploadModal.isOpen && (
        <ReceiptUploadModal
          onConfirm={handleReceiptUploadConfirm}
          onCancel={receiptUploadModal.close}
          selectedFile={receiptUploadModal.state.selectedFile}
          fileChangeHandler={(file) => receiptUploadModal.setState({ selectedFile: file })}
        />
      )}

      {/* 영수증 인식 식재료 추가 모달 */}
      {addIngredientModal.isOpen && (
        <AddIngredientModal
          purchaseDate={addIngredientModal.state.purchaseDate}
          matchedItems={addIngredientModal.state.matchedItems}
          onClose={addIngredientModal.close}
        />
      )}

      {/* 직접 입력 식재료 추가 모달 */}
      {manualModal.isOpen &&
        <AddManualIngredientModal
          onClose={manualModal.close} />
      }

      {/* 상세 정보 모달 */}
      {detailModal.isOpen && detailModal.state && (
        <IngredientDetailsModal
          row={detailModal.state}
          onQuantityUpdated={(updatedIngredient) => {
            updateIngredient(updatedIngredient);
            detailModal.close();
          }}
          onClose={detailModal.close}
        />
      )}

      {/* 로딩 모달 */}
      {loading && <LoadingModal />}
      <HomeNavBar />
    </div>
  );
};

export default MyIngredientsPage;
