// src/components/atoms/DropdownFilter.js

import React from 'react';
import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DropdownFilter = ({ options, value, onChange }) => {
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

DropdownFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DropdownFilter;
