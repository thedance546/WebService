// src/features/Admin/IngredientForm.tsx

import React, { useState } from "react";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import DropdownFilter from "../../components/atoms/DropdownFilter";

interface IngredientFormProps {
  categories: { categoryName: string }[];
  storageMethods: { storageMethodName: string }[];
  onAddItem: (item: {
    itemName: string;
    categoryName: string;
    storageMethodName: string;
    sellByDays: number | string;
    useByDays: number | string;
  }) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ categories, storageMethods, onAddItem }) => {
  const [newItemName, setNewItemName] = useState("");
  const [sellByDays, setSellByDays] = useState<number | string>("");
  const [useByDays, setUseByDays] = useState<number | string>("");
  const [categoryName, setCategoryName] = useState("");
  const [storageMethodName, setStorageMethodName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newItemName || !categoryName || !storageMethodName) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }
    onAddItem({
      itemName: newItemName,
      categoryName,
      storageMethodName,
      sellByDays,
      useByDays,
    });
    setNewItemName("");
    setSellByDays("");
    setUseByDays("");
    setCategoryName("");
    setStorageMethodName("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-100 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="w-20">
          <label>식재료 이름</label>
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="식재료 이름"
          />
        </div>
        <div className="w-20">
          <label>유통기한 (일)</label>
          <Input
            type="number"
            value={sellByDays}
            onChange={(e) => setSellByDays(e.target.value)}
            placeholder="유통기한"
          />
        </div>
        <div className="w-20">
          <label>소비기한 (일)</label>
          <Input
            type="number"
            value={useByDays}
            onChange={(e) => setUseByDays(e.target.value)}
            placeholder="소비기한"
          />
        </div>
        <div className="w-20">
          <label>카테고리</label>
          <DropdownFilter
            options={categories.map((cat) => ({
              value: cat.categoryName,
              label: cat.categoryName,
            }))}
            value={categoryName}
            onChange={setCategoryName}
          />
        </div>
        <div className="w-20">
          <label>보관 방법</label>
          <DropdownFilter
            options={storageMethods.map((method) => ({
              value: method.storageMethodName,
              label: method.storageMethodName,
            }))}
            value={storageMethodName}
            onChange={setStorageMethodName}
          />
        </div>
      </div>
      <div className="text-end mt-3">
        <Button type="submit" className="btn btn-primary">
          식재료 추가
        </Button>
      </div>
    </form>
  );
};

export default IngredientForm;
