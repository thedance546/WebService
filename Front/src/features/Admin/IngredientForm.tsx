import React, { useState } from "react";
import Input from "../../components/atoms/Input";
import Button from "../../components/atoms/Button";
import DropdownFilter from "../../components/atoms/DropdownFilter";
import { Category, StorageMethod } from "../../types/EntityTypes";

interface IngredientFormProps {
  categories: Category[];
  storageMethods: StorageMethod[];
  onAddItem: (item: {
    name: string;
    categoryId: number;
    storageMethodId: number;
    sellByDays: number | string;
    useByDays: number | string;
  }) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ categories, storageMethods, onAddItem }) => {
  const [name, setName] = useState("");
  const [sellByDays, setSellByDays] = useState<number | string>("");
  const [useByDays, setUseByDays] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [storageMethodId, setStorageMethodId] = useState<number | string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !categoryId || !storageMethodId) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }
    onAddItem({
      name,
      categoryId: Number(categoryId),
      storageMethodId: Number(storageMethodId),
      sellByDays,
      useByDays,
    });
    setName("");
    setSellByDays("");
    setUseByDays("");
    setCategoryId("");
    setStorageMethodId("");
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
              value: String(cat.id),
              label: cat.categoryName,
            }))}
            value={String(categoryId)}
            onChange={(val) => setCategoryId(Number(val))}
          />
        </div>
        <div className="w-20">
          <label>보관 방법</label>
          <DropdownFilter
            options={storageMethods.map((method) => ({
              value: String(method.id),
              label: method.storageMethodName,
            }))}
            value={String(storageMethodId)}
            onChange={(val) => setStorageMethodId(Number(val))}
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
