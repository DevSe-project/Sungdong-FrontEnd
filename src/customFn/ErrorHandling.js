// errorHandling.js

let errorDisplayed = false;

export const handleUnauthorizedError = (errorMessage) => {
    if (!errorDisplayed) {
        console.error(errorMessage);
    }
    errorDisplayed = true;
    };

    export const handleForbiddenError = (errorMessage, navigate) => {
    if (!errorDisplayed) {
        alert(errorMessage);
        navigate("/login");
    }
    errorDisplayed = true;
    };

    export const handleOtherErrors = (errorMessage) => {
    if (!errorDisplayed) {
        alert(errorMessage);
    }
    errorDisplayed = true;
    };
