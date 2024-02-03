import axios from '../axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCookie } from './GetCookie';

// Custom hook for fetching data
export const useFetch = () => {
const [errorDisplayed, setErrorDisplayed] = useState(false);
const navigate = useNavigate();

const handleUnauthorizedError = (errorMessage) => {
    if (!errorDisplayed) {
        alert(errorMessage);
        navigate("/login");
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

const handleNoAlertOtherErrors = (errorMessage) => {
    if (!errorDisplayed) {
        console.error(errorMessage)
    }
    setErrorDisplayed(true);
};

const fetchServer = async (item, fetchType, router, pageNumber) => {
    try {
    const token = GetCookie("jwt_token");
    const response = await axios[fetchType](`${router}?page=${pageNumber}`,
        JSON.stringify(item), 
        {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    return response.data;
    } catch (error) {
    if (error.response && error.response.status === 400) {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 401) {
        handleUnauthorizedError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    }
    }
};

const fetchGetServer = async (router, pageNumber) => {
    try {
    const token = GetCookie("jwt_token");
    const response = await axios.get(`${router}?page=${pageNumber}`, 
        {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    return response.data.data;
    } catch (error) {
    if (error.response && error.response.status === 400) {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 401) {
        handleUnauthorizedError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    }
    }
};

const fetchAddPostServer = async (item, fetchType, router, pageNumber, postCnt) => {
    try {
    const token = GetCookie("jwt_token");
    const response = await axios[fetchType](`${router}?page=${pageNumber}&post=${postCnt}`,
        JSON.stringify(item), 
        {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    return response.data;
    } catch (error) {
    if (error.response && error.response.status === 400) {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 401) {
        handleUnauthorizedError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    }
    }
};

const fetchGetAddPostServer = async (router, pageNumber, postCnt) => {
    try {
    const token = GetCookie("jwt_token");
    const response = await axios.get(`${router}?page=${pageNumber}&post=${postCnt}`, 
        {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    return response.data.data;
    } catch (error) {
    if (error.response && error.response.status === 400) {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 401) {
        handleUnauthorizedError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message)
    } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message)
    }
    }
};

return {
    fetchServer,
    fetchGetServer,
    fetchAddPostServer,
    fetchGetAddPostServer,
    handleForbiddenError,
    handleOtherErrors,
    handleUnauthorizedError,
    handleNoAlertOtherErrors
};
};
