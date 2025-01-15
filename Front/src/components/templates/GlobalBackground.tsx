// src/components/templates/GlobalBackground.tsx

import React, { CSSProperties, ReactNode } from 'react';
import logo from '../../assets/matjipsa_logo.webp';
import title from '../../assets/matjipsa_title.webp';

interface GlobalBackgroundProps {
  children: ReactNode;
}

const GlobalBackground: React.FC<GlobalBackgroundProps> = ({ children }) => {
  const containerStyle: CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden', // 오버플로우 방지
  };

  const backgroundStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/Images/Background_Welcome.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.6, // 투명도 설정
    zIndex: 1,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  };

  const logoImageStyle: CSSProperties = {
    width: '100px',
    height: '100px',
  };

  const titleImageStyle: CSSProperties = {
    width: '200px',
    height: 'auto',
  };

  return (
    <div style={containerStyle}>
      {/* 배경 이미지 */}
      <div style={backgroundStyle}></div>

      {/* 콘텐츠 영역 */}
      <div style={contentStyle}>
        {/* 로고와 타이틀 출력 */}
        <div style={logoStyle}>
          <img src={logo} alt="맛집사 로고" style={logoImageStyle} />
          <img src={title} alt="맛집사 타이틀" style={titleImageStyle} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;
