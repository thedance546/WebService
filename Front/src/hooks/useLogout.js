// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { logout } from "../services/Api";
import { removeTokens } from "../utils/Utils";

const useLogout = () => {
  const navigate = useNavigate();
  return async () => {
    const { success, message } = await logout();
    if (success) {
      removeTokens();
      navigate('/');
    }
    return message;
  };
};

export default useLogout;
