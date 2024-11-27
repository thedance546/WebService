// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { logout } from "../services/Api";

const useLogout = () => {
    const navigate = useNavigate();
    return async () => {
      const { success, message } = await logout();
      if (success) {
        navigate('/');
      }
      return message;
    };
};

export default useLogout;
