import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import MainLogo from '../../image/sungdonglogo.svg';
import { useState } from 'react';
import FindModal from './FindModal';
import CodeInputModal from './CodeInputModal';
import axios from 'axios';
import { useDataActions, useIsLogin, useModal, useModalActions, useModalState, useSetLogin, useUserData } from '../../Store/DataStore';
import { useMutation } from '@tanstack/react-query';

export function Login(props) {

  const { isModal, modalName } = useModalState();
  const {selectedModalOpen} = useModalActions();
  const { setLogin } = useSetLogin();
  const { isLogin } = useIsLogin();
  const userData = useUserData();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const navigate = useNavigate();

  //로그인 요청 처리 로직
  const { joinMutate } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (login) => {
      // 메세지 표시
      alert(login.message);
      console.log('로그인 되었습니다.', login);
      // 홈 화면으로 이동
      navigate("/");
      // 로그인 상태 TRUE
      setLogin(true);
      return login.token;
    },
    onError: (error) => {
      // 회원 추가 실패 시, 에러 처리
      console.error('회원가입 중 오류가 발생했습니다.', error);
      alert('아이디 혹은 비밀번호를 확인주세요.'); //경고문구 출력
    },
  })


  //로그인 요청 함수
  const goLogin = async () => {
    try {
      const token = await joinMutate();
      // 토큰을 쿠키에 저장
      document.cookie = `jwt_token=${token}; path=/; secure; HttpOnly`;
      // 동시에 로컬 스토리지나 세션 스토리지에도 저장
      JSON.stringify(sessionStorage.setItem('saveLoginData', token));
    } catch { // 서버가 없는경우 기존 태훈, 지석 코드
      developLogin();
    }
  }
  // 로그인 처리 로직
  async function loginRequest() {
    const response = await axios.post(
      "/user",
      JSON.stringify({
        id: id,
        password: pw
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    return response;
  }

  function developLogin() { //서버 없이 테스트용 로그인 함수
    const confirmUser = userData.find(userData => userData.id === id && userData.password === pw); //UserData의 id,password와 input받은 id,pw값이 일치하는 것을 꺼내옴
    if (confirmUser && confirmUser.id === id && confirmUser.password === pw) { //꺼내 온 id,pw가 일치한다면 
      setId(''); //입력된 id를 지움
      setPw(''); //입력된 pw를 지움
      console.log(userData); //확인된 유저데이터에 뭐가 들었는지 console로 확인
      //session에 담을 data 객체
      const LoginDataObj = {
        id: id,
        pw: pw,
      }
      sessionStorage.setItem('saveLoginData', JSON.stringify(LoginDataObj));
      setLogin(true);
      navigate('/'); //메인페이지로 이동하면서
      alert('성동물산에 오신 걸 환영합니다!'); //환영문구 출력
      window.location.reload();
    } else { //일치하지 않다면
      alert('아이디 혹은 비밀번호를 확인주세요.'); //경고문구 출력
    }
  }

  // 자동로그인 - 로그인정보 로컬스토리지 저장 (아직 다른 곳에서 getItem하는 부분을 안 만든 상태라 적용 안 될 것)
  function autoLogin() {
    localStorage.setItem('autoLogin',)
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
              <div className={styles.autoLoginCheckBox}>
                <input type='checkbox' id='autoCheckbox' />
                <label htmlFor="autoCheckbox" onClick={autoLogin}>로그인 상태 유지</label>
              </div>
              {/* Login Button */}
              <div className={styles.goLogin}
                onClick={goLogin}
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