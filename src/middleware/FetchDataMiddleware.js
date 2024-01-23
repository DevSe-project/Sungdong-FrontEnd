import axios from "axios";
import { GetCookie } from "../customFn/GetCookie";

// 미들웨어 함수 정의
const fetchDataMiddleware = async (url, config = {}) => {
  try {
    const token = GetCookie('jwt_token');
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...config.headers, // 다른 헤더 옵션을 추가할 수 있도록 기존 헤더를 전개 연산자로 추가
      },
      ...config, // 다른 axios 설정 옵션을 추가할 수 있도록 기존 설정을 전개 연산자로 추가
    });

    return response.data;
  } catch (error) {
    throw new Error(`데이터를 불러오는 중 오류가 발생했습니다. (${error.message})`);
  }
};

export default fetchDataMiddleware;

