import { useNavigate } from "react-router-dom";
import styles from './Join.module.css';
import logo from '../image/logo.jpeg'

export default function JoinInputInformation() {

    return(
        <div>
            <div className={styles.logo}>
                <img
                    src={logo}
                    alt="쇼핑몰 로고"
                />
            </div>
        </div>
    )
}