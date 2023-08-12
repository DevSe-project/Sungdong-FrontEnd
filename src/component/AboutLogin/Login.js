import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import MainLogo from '../../image/MainLogo.jpeg';

export function Login(props) {
  const navigate = useNavigate();
  return (
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
        {/* 뭐하지 */}
        <div className={styles.container}>
          {/* loginContainer */}
          <div className={styles.loginContainer}>
            <div className={styles.inputContainer}>
              {/* ID */}
              <div>
                <input type='text' className={styles.inputId} placeholder={"아이디를 입력하세요"} />
              </div>
              {/* PW */}
              <div>
                <input type='password' className={styles.inputPW} placeholder={"패스워드를 입력하세요"} />
              </div>
              <div className={styles.autoLoginCheckBox}>
                <input type='checkbox' />로그인 상태 유지
              </div>
              {/* Login Button */}
              <div className={styles.goLogin}>
                로그인
              </div>
            </div>
          </div>



          {/* Find Id&PW Button | join Button */}
            <div className={styles.findDiv}>
              <div className={styles.findId} onClick={ () => {navigate('/findID')} }>아이디 찾기</div>
              <div>|</div>
              <div className={styles.findPW} onClick={ () => {navigate('/findPW')} }>비밀번호 찾기</div>
              <div>|</div>
              <div className={styles.join} onClick={ () => {navigate('/join')} }>회원가입</div>
            </div>
        </div>
      </div>

    </div>
  )
}