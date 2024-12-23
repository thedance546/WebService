// src/components/Settings/ThemeSelector.js
import React, { useEffect, useState } from 'react';

const ThemeSelector = () => {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, [theme]);

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingThemeSetting">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseThemeSetting"
          aria-expanded="false"
          aria-controls="collapseThemeSetting"
        >
          테마 설정
        </button>
      </h2>
      <div
        id="collapseThemeSetting"
        className="accordion-collapse collapse"
        aria-labelledby="headingThemeSetting"
        data-bs-parent="#settingsAccordion"
      >
        <div className="accordion-body">
          <div className="btn-group w-100" role="group" aria-label="Theme selector">
            <button
              type="button"
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTheme('light')}
            >
              화이트 모드
            </button>
            <button
              type="button"
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTheme('dark')}
            >
              다크 모드
            </button>
            <button
              type="button"
              className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setTheme('system')}
            >
              기기 테마
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
