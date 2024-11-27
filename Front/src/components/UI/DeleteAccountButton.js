// src/components/UI/DeleteAccountButton.js
import React from "react";
import useDeleteAccount from "../../hooks/useDeleteAccount";

const DeleteAccountButton = () => {
  const deleteAccount = useDeleteAccount();

  const handleDeleteAccount = async () => {
    const message = await deleteAccount();
    alert(message);
  };

  return (
    <button onClick={handleDeleteAccount} className="btn btn-danger w-100">
      회원탈퇴
    </button>
  );
};

export default DeleteAccountButton;
