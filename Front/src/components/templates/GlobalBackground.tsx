// src/components/templates/GlobalBackground.tsx

import React, { CSSProperties, ReactNode } from 'react';

interface GlobalBackgroundProps {
  children: ReactNode;
}

const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ children }) => {
  const style: CSSProperties = {
    backgroundImage: 'url(/Images/Background_Welcome.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <div style={style}>{children}</div>;
};

export default GlobalBackground;
