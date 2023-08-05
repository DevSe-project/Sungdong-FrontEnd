import { useNavigate } from "react-router-dom";
import styles from './Join.module.css';
import logo from '../image/logo.jpeg'

export default function Join() {
    let navigate = useNavigate();
    return (
        <div>
            {/* 로고 */}
            <div className={styles.logo}>
                <img
                    src={logo}
                    alt="쇼핑몰 로고"
                    onClick={() => { navigate("/") }}
                />
            </div>
            {/* 체크박스 컨테이너 */}
            <div className={styles.checkboxContainer}>
                {/* 전체 동의하기 */}
                <div className={styles.checkbox}>
                    <input type="checkbox"/>전체 동의하기
                </div>
                {/* [필수] 이용약관 */}
                <div className={styles.checkbox}>
                    <input type="checkbox"/>[필수]성동물산 이용약관
                    <div className={styles.detail}>
                        대충 약관임
                    </div>
                </div>
                {/* [필수] 개인정보 수집 및 이용 */}
                <div className={styles.checkbox}>
                    <input type="checkbox"/>[필수]개인정보 수집 및 이용
                    <div className={styles.detail}>
                        대충 약관임
                    </div>
                </div>
                {/* [선택] 이벤트・혜택 정보 수신 */}
                <div className={styles.checkbox}>
                    <input type="checkbox"/>이벤트・혜택 정보 수신
                    <div className={styles.detail}>
                        대충 약관임
                    </div>
                </div>
            </div>
        </div>
    )
}