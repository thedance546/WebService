import React, { useState } from 'react';

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

// JSON 데이터 직접 포함
const teamMembersData: TeamMember[] = [
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        개발팀 정보
      </button>

      {isModalOpen && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">개발팀 정보</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
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
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamInfo;
