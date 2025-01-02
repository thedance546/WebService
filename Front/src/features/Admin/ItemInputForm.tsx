// src/features/Admin/ItemInputForm.tsx

import React, { useState } from "react";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import DropdownFilter from "../../components/atoms/DropdownFilter";
import { Category, StorageMethod, Item } from "../../types/EntityTypes";

interface IngredientFormProps {
  categories: Category[];
  storageMethods: StorageMethod[];
  onAddItem: (item: Item) => void; // Item 타입으로 변경
}

const IngredientForm: React.FC<IngredientFormProps> = ({ categories, storageMethods, onAddItem }) => {
  const [name, setName] = useState("");
  const [sellByDays, setSellByDays] = useState<number | string>("");
  const [useByDays, setUseByDays] = useState<number | string>("");
  const [categoryName, setCategoryName] = useState("");
  const [storageMethodName, setStorageMethodName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !categoryName || !storageMethodName) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }
    const newItem: Item = {
      id: 0,
      itemName: name,
      category: { id: 0, categoryName },
      storageMethod: { id: 0, storageMethodName },
      shelfLife: {
        id: 0,
        sellByDays: Number(sellByDays),
        useByDays: Number(useByDays),
      },
    };
    onAddItem(newItem);
    setName("");
    setSellByDays("");
    setUseByDays("");
    setCategoryName("");
    setStorageMethodName("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-100 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="w-20">
          <label>아이템 이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="아이템 이름"
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
            onChange={(val) => setCategoryName(val)}
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
            onChange={(val) => setStorageMethodName(val)}
          />
        </div>
      </div>
      <div className="text-end mt-3">
        <Button type="submit" className="btn btn-primary">
          아이템 추가
        </Button>
      </div>
    </form>
  );
};

export default IngredientForm;
