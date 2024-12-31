// src/components/atoms/RadioBox.tsx

import React from 'react';

interface RadioBoxProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
}

const RadioBox: React.FC<RadioBoxProps> = ({ name, value, checked, onChange, label }) => {
  return (
    <label className="form-check-label">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="form-check-input me-2"
      />
      {label}
    </label>
  );
};

export default RadioBox;
