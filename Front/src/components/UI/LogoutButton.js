// src/components/UI/LogoutButton.js
import React from "react";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const logout = useLogout();
  
  const handleLogout = async () => {
    const message = await logout();
    alert(message);
  };

  return (
    <button onClick={handleLogout} className="btn btn-warning w-100">
      로그아웃
    </button>
  );
};

export default LogoutButton;
