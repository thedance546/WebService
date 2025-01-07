// src/components/organisms/EditIngredientForm.tsx

import React from 'react';
import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';
import { Ingredient } from '../../types/EntityTypes';

interface EditIngredientFormProps {
  ingredients: Ingredient[];
  onIngredientsChange: (updatedIngredients: Ingredient[]) => void;
}

const EditIngredientForm: React.FC<EditIngredientFormProps> = ({
  ingredients,
  onIngredientsChange,
}) => {
  const handleEdit = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    onIngredientsChange(updated);
  };

  const handleAddRow = () => {
    onIngredientsChange([...ingredients, { ingredientId: Date.now(), name: '', quantity: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(updated);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>수량</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((item, index) => (
            <tr key={item.ingredientId}>
              <td>
                <Input
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => handleEdit(index, 'name', e.target.value)}
                  className="form-control"
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={item.quantity ?? 0} // 기본값을 0으로 설정
                  onChange={(e) => handleEdit(index, 'quantity', Number(e.target.value) || 0)}
                  className="form-control"
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveRow(index)}
                  className="btn-sm"
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" onClick={handleAddRow}>
          항목 추가
        </Button>
      </div>
    </div>
  );
};

export default EditIngredientForm;
