import axios from '../axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCookie } from './GetCookie';

// Custom hook for fetching data
/**
 * @Functions
 * - fetchNonPageServer(item, fetchType, router)
 * - fetchServer(item, fetchType, router, pageNumber)
 * - fetchGetServer(router, pageNumber)
 * - fetchAddPostServer(item, fetchType, router, pageNumber, postCnt)
 * - fetchGetAddPostServer(router, pageNumber, postCnt)
 * @returns 
 */
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
		alert(errorMessage);
	};

	const handleNoAlertOtherErrors = (errorMessage) => {
		if (!errorDisplayed) {
			console.error(errorMessage)
		}
		setErrorDisplayed(true);
	};

	/**
	 * @논페이지요청
	 * 페이지가 없는 데이터 API 요청 함수
	 * 
	 * @param {*} item 첫번째 파라미터 : API 요청 대상 데이터 
	 * @param {*} fetchType 두번째 파라미터 : API FETCH 타입 
	 * @param {*} router 세번째 파라미터 : API 라우터 경로
	 * @returns 리턴형식 : response.data
	 */
	const fetchNonPageServer = async (item, fetchType, router) => {
		try {
			const token = GetCookie("jwt_token");
			const response = await axios[fetchType](`${router}`,
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

	/**
	 * @페이지요청
	 * 페이지가 있는 데이터 API 요청 함수
	 * 
	 * @param {*} item 첫번째 파라미터 : API 요청 대상 데이터
	 * @param {*} fetchType 두번째 파라미터 : API FETCH 타입
	 * @param {*} router 세번째 파라미터 : API 라우터 경로
	 * @param {*} pageNumber 네번째 파라미터 : 현재 페이지 숫자
	 * @returns 리턴형식 : response.data
	 */
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

	/**
	 * @GET페이지요청
	 * 페이지가 있는 GET 요청 전용 함수
	 * 
	 * @param {*} router 첫번째 파라미터 : API 요청 경로
	 * @param {*} pageNumber 두번째 파라미터 : 현재 페이지 숫자
	 * @returns 리턴형식 : response.data.data
	 */
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

	/**
	 * @페이지요청
	 * 페이지와 페이지당 개수를 지정할 수 있는 API 요청 함수
	 * 
	 * @param {*} item 첫번째 파라미터 : API 요청 대상 데이터
	 * @param {*} fetchType 두번째 파라미터 : API 요청 타입
	 * @param {*} router 세번째 파라미터 : API 요청 경로
	 * @param {*} pageNumber 네번째 파라미터 : 현재 페이지 숫자
	 * @param {*} postCnt 다섯번째 파라미터 : 페이지당 몇 개를 렌더링 할 건지
	 * @returns 리턴형식 : response.data
	 */
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

	/**
	 * @GET페이지요청
	 * 페이지와 페이지당 개수를 지정할 수 있는 GET 전용 API 요청 함수
	 * 
	 * @param {*} router 첫번째 파라미터 : API 요청 경로
	 * @param {*} pageNumber 두번째 파라미터 : 현재 페이지 숫자
	 * @param {*} postCnt 세번째 파라미터 : 페이지당 몇 개를 렌더링 할 건지
	 * @returns 리턴형식 : response.data.data
	 */
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
		fetchNonPageServer,
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
