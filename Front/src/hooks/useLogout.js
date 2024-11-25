// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { logoutService } from "../services/logoutService";

const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        logoutService();
        navigate("/");
    };

    return logout;
};

export default useLogout;
