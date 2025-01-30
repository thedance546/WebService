// src/features/Settings/TeamInfo.tsx

import React from 'react';

const teamMembersData = [
  {
    name: "서진석",
    email: "realstone513@gmail.com",
    role: "조장, 프론트엔드 개발"
  },
  {
    name: "강구성",
    email: "9saycan@gmail.com",
    role: "딥러닝 엔지니어 (LLM)"
  },
  {
    name: "강민기",
    email: "marco9645@gmail.com",
    role: "딥러닝 엔지니어 (LLM)"
  },
  {
    name: "장선아",
    email: "sajang2001@gmail.com",
    role: "딥러닝 엔지니어 (YOLO)"
  },
  {
    name: "한서연",
    email: "tjdus3858@gmail.com",
    role: "백엔드 개발"
  },
  {
    name: "허정모",
    email: "heojeongmo364@gmail.com",
    role: "딥러닝 엔지니어 (YOLO)"
  }
];

const TeamInfo: React.FC = () => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingTeamInfo">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTeamInfo"
          aria-expanded="false"
          aria-controls="collapseTeamInfo"
        >
          개발팀 정보
        </button>
      </h2>
      <div
        id="collapseTeamInfo"
        className="accordion-collapse collapse"
        aria-labelledby="headingTeamInfo"
        data-bs-parent="#settingsAccordion"
      >
        <div className="accordion-body">
          <div className="row">
            {teamMembersData.map((member, index) => (
              <div key={index} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {member.name}{' '}
                      <span className="text-muted">({member.email})</span>
                    </h5>
                    <p className="card-text">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;
