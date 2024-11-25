// src/components/UI/LogoutButton.js
import React from "react";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const logout = useLogout();

  return (
    <button onClick={logout} className="btn btn-warning w-100">
      로그아웃
    </button>
  );
};

export default LogoutButton;
