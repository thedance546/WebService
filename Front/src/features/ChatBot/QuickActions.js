// src/features/ChatBot/QuickActions.js
import React from 'react';
import PropTypes from 'prop-types';
import './QuickActions.css';

const QuickActions = ({ actions }) => {
  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="quick-action-btn"
        >
          {action.icon} {action.label}
        </button>
      ))}
    </div>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default QuickActions;
