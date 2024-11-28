// src/components/templates/GlobalBackground.js
import React from 'react';

const GlobalBackground = ({ title, children, cardStyle = {}, cardClassName = '' }) => {
  const style = {
    backgroundImage: 'url(/Images/Background_Welcome.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={style} className="d-flex flex-column align-items-center min-vh-100">
      {title && (
        <div
          className="text-light text-center"
          style={{
            marginTop: '6dvh',
            marginBottom: '2vh',
            fontSize: '2rem',
          }}
        >
          {title}
        </div>
      )}
      <div
        className={`card p-4 shadow-sm ${cardClassName}`}
        style={{
          maxWidth: '600px',
          width: '85%',
          ...cardStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;
