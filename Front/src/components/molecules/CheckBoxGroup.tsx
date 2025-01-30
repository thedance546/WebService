// src/components/molecules/CheckBoxGroup.tsx

import React from 'react';
import CheckBox from '../atoms/CheckBox';

interface CheckBoxGroupProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({ options, selectedValues, onChange }) => {
  return (
    <div>
      {options.map((option) => (
        <CheckBox
          key={option.value}
          value={option.value}
          checked={selectedValues.includes(option.value)}
          onChange={onChange}
          label={option.label}
        />
      ))}
    </div>
  );
};

export default CheckBoxGroup;
