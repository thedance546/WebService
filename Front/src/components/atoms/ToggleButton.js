// src/components/atoms/ToggleButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton as BootstrapToggleButton } from 'react-bootstrap';

const ToggleButton = ({ id, value, selected, onClick, children, className }) => {
  return (
    <BootstrapToggleButton
      id={id}
      value={value}
      variant={selected ? 'primary' : 'outline-primary'}
      onClick={onClick}
      className={className}
    >
      {children}
    </BootstrapToggleButton>
  );
};

ToggleButton.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

ToggleButton.defaultProps = {
  className: '',
};

export default ToggleButton;