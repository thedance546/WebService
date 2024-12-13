// src/components/molecules/ToggleButtonGroup.js
import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '../atoms/ToggleButton';
import { ToggleButtonGroup as BootstrapToggleButtonGroup } from 'react-bootstrap';

const ToggleButtonGroup = ({ type, name, value, options, onChange, className }) => {
  return (
    <BootstrapToggleButtonGroup
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          id={option.id}
          value={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          className="w-50"
        >
          {option.label}
        </ToggleButton>
      ))}
    </BootstrapToggleButtonGroup>
  );
};

ToggleButtonGroup.propTypes = {
  type: PropTypes.oneOf(['radio', 'checkbox']).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ToggleButtonGroup.defaultProps = {
  className: '',
};

export default ToggleButtonGroup;