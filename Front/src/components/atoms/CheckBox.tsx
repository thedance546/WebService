// src/components/atoms/CheckBox.tsx

import React from 'react';

interface CheckBoxProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ value, checked, onChange, label }) => {
  return (
    <label className="form-check-label">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="form-check-input me-2"
      />
      {label}
    </label>
  );
};

export default CheckBox;
