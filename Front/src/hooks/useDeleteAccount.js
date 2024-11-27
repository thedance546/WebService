// src/hooks/useDeleteAccount.js
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/Api";
import { removeTokens } from "../utils/Utils";

const useDeleteAccount = () => {
    const navigate = useNavigate();
    return async () => {
        const { success, message } = await deleteAccount();
        if (success) {
            removeTokens();
            navigate('/');
        }
        return message;
    };
};

export default useDeleteAccount;