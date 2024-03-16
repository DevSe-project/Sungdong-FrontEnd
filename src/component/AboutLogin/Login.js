import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import MainLogo from '../../image/sungdonglogo.svg';
import { useState } from 'react';
import FindModal from './FindModal';
import CodeInputModal from './CodeInputModal';
import axios from '../../axios';
import { useModalActions, useModalState } from '../../store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function Login(props) {

  const { isModal, modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 로그인 처리 로직
  const loginRequest = async (loginData) => {
    try {
      const response = await axios.post("/auth/login",
        JSON.stringify(
          loginData
        ),
        {
          credentials: 'include', // withCredentials: true 와 같은 효과
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // 서버가 400을 반환한 경우
        alert(error.response.data.message);
        navigate("/login");
        throw new Error(error.response.data.message);
      } else {
        // 실패 시 예외를 throw합니다.
        throw new Error('로그인 중 오류가 발생했습니다.');
      }
    }
  }

  //로그인 요청 처리 로직
  const { mutate: loginMutate } = useMutation({ mutationFn: loginRequest })


  //로그인 요청 함수
  const goLogin = () => {
    // try {
    loginMutate({ userId: id, userPassword: pw }, {
      onSuccess: (data) => {
        console.log('User logined successfully:', data);
        alert(data.message);
        // 홈 화면으로 이동
        navigate("/");
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.invalidateQueries(['user']);
        // 토큰을 쿠키에 저장
        // document.cookie = `jwt_token=${data.token}; path=/;`;
      },
      onError: (error) => {
        console.error('User creation failed:', error);
        // 에러 처리 또는 메시지 표시
      },
    });
  }

  function autoLogin() {

  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { //누른 키가 Enter라면
      goLogin(); //goLogin함수 실행
    }
  }
  return (
    // 화면 정렬을 위해 전체div에 style부여
    <div className={styles.body}>
      {/* loginPageContainer */}
      <div className={styles.loginPageContainer}>
        {/* Logo */}
        <div className="hello">
          <img
            src={MainLogo}
            alt="로고"
            height={250}
            className={styles.logo}
            onClick={() => { navigate("/") }}
          />
        </div>
        {/* LoginContentsContainer */}
        <div className={styles.loginContentsContainer}>
          {/* loginContainer */}
          <div className={styles.loginContainer}>
            <div className={styles.inputContainer}>
              {/* ID 입력란 */}
              <div>
                <input type='text' className={styles.inputId} placeholder={"아이디를 입력하세요"} value={id} onChange={e => setId(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
              {/* PW 입력란*/}
              <div>
                <input type='password' className={styles.inputPW} placeholder={"패스워드를 입력하세요"} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
              {/* Login Button */}
              <div className={styles.goLogin}
                onClick={() => goLogin()}
              >
                로그인
              </div>
            </div>
          </div>

          {/* Find Id&PW Button | join Button */}
          <div className={styles.findDiv}>
            <div className={styles.findId}
              onClick={() => { selectedModalOpen('find_id'); }}>아이디/비밀번호 찾기</div>
            <div>|</div>
            <div className={styles.join}
              onClick={() => { selectedModalOpen('code') }}>회원가입</div>
          </div>
        </div>

        {/* 아이디or비밀번호 둘 중 하나를 누르기만 하면 찾기창 오픈 
         ->오픈했을 때 나타나는 화면은 openModal의 state에 따라 FindModal.js에서 결정 */}

        {/* 아이디 찾기 */}
        {isModal && modalName === 'find_id' &&
          <FindModal />}

        {/* 비밀번호 찾기 */}
        {isModal && modalName === 'find_pw' &&
          <FindModal />}

        {/* join.js로 이동하기 전 인증코드 입력 */}
        {isModal && modalName === 'code' &&
          <CodeInputModal codeState={props.codeState} setCode={props.setCodeState} />}
      </div>

    </div>
  )
}