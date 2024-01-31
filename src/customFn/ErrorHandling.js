import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useErrorHandling = () => {
const [errorDisplayed, setErrorDisplayed] = useState(false);
const navigate = useNavigate();

const handleUnauthorizedError = (errorMessage) => {
    if (!errorDisplayed) {
    console.error(errorMessage);
    }
    setErrorDisplayed(true);
};

const handleForbiddenError = (errorMessage) => {
    if (!errorDisplayed) {
    alert(errorMessage);
    navigate("/login");
    }
    setErrorDisplayed(true);
};

const handleOtherErrors = (errorMessage) => {
    if (!errorDisplayed) {
    alert(errorMessage);
    }
    setErrorDisplayed(true);
};

return { handleUnauthorizedError, handleForbiddenError, handleOtherErrors };
};
