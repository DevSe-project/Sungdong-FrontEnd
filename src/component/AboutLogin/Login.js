import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import MainLogo from '../../image/MainLogo.jpeg';
import { useState } from 'react';
import FindModal from './FindModal';
import { UserData } from '../Data/UserData';

export function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');


  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null); //modal type이 id? pw?

  const openModal = (type) => {
    setModalType(type) //onClick에서 type을 넣어 id면 idModal이 pw면 pwModal이 나타나도록.
  }

  const closeModal = () => {
    setModalType(null); //초기화 시켜서 모달창을 닫음
  }

  const goLogin = () => {
    const confirmUser = UserData.find( userData => userData.id === id && userData.password === pw);
    if (confirmUser && confirmUser.id === id && confirmUser.password === pw) {
      setId(null);
      setPw(null);
      console.log(confirmUser); //확인된 유저데이터에 뭐가 들었는지 console로 확인
      navigate('/');
      alert('성동물산에 오신 걸 환영합니다!')
    } else {

      console.log(id === UserData.id)
      alert('아이디 혹은 비밀번호를 확인주세요.')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      goLogin();
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
                <input type='checkbox' id='autoCheckbox' /><label for="autoCheckbox">로그인 상태 유지</label>
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
            <div className={styles.findId} onClick={() => { openModal('id') }}>아이디 찾기</div>
            <div>|</div>
            <div className={styles.findPW} onClick={() => { openModal('pw') }}>비밀번호 찾기</div>
            <div>|</div>
            <div className={styles.join} onClick={() => { navigate('/join') }}>회원가입</div>
          </div>
        </div>

        {modalType && (
          <FindModal type={modalType} onClose={closeModal} openModal={openModal} />
        )}
      </div>

    </div>
  )
}