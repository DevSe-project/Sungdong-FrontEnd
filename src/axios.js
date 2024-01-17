import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050', // 기본 URL
  timeout: 5000, // 요청을 보내는 데 최대 대기 시간 (밀리초)
  headers: {
    'Content-Type': 'application/json',
    // 기타 헤더 설정
  },
  crossDomain: true,
  withCredentials: true
});

export default instance;