// src/components/atoms/DropdownFilter.tsx

import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ options, value, onChange }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary">{value}</Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={() => onChange(option.value)}>
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownFilter;
