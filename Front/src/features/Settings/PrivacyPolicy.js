// src/features/Settings/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingPrivacyPolicy">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsePrivacyPolicy"
          aria-expanded="false"
          aria-controls="collapsePrivacyPolicy"
        >
          개인정보 처리방침 보기
        </button>
      </h2>
      <div
        id="collapsePrivacyPolicy"
        className="accordion-collapse collapse"
        aria-labelledby="headingPrivacyPolicy"
        data-bs-parent="#settingsAccordion"
      >
        <div className="accordion-body">
          <p>여기에 개인정보 처리방침 내용이 표시됩니다...</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
