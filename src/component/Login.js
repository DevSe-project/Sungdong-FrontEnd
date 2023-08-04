import { Navigate, useNavigate } from 'react-router-dom'
import App from '../App.js'
import styles from './Login.module.css'

export function Login(props) {
  const navigate = useNavigate();
  return (
    <div>
      {/* loginPageContainer */}
      <div className={styles.loginPageContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <img
            src="/img/MainLogo.jpeg"
            alt="쇼핑몰 로고"
            className="logo-image"
            onClick={() => { navigate("/") }}
          />
        </div>
{/* 뭐하지 */}
        <div className={styles.loginContainer}>
          {/* loginContainer */}
          <div className={styles.loginContainer}>
            <div className={styles.inputContainer}>
              {/* ID */}
              <div>
                <input className={styles.inputId} value={"아이디를 입력하세요"} />
              </div>
              {/* PW */}
              <div>
                <input className={styles.inputPW} value={"패스워드를 입력하세요"} />
              </div>
            </div>
            {/* Login Button */}
            <div className={styles.goLogin}>
              로그인
            </div>
          </div>
          {/* Find Id&PW Button | join Button */}
          <div className={styles.autoLogin}>
            <input type='checkbox' value={"자동 로그인"} />자동로그인
          </div>
          <div className={styles.find_join}>
            <div className={styles.findId}>아이디</div>
            <div className={styles.findPW}>/비밀번호 찾기</div>
            <div className={styles.join}>회원가입</div>
          </div>
        </div>
      </div>

    </div>
  )
}