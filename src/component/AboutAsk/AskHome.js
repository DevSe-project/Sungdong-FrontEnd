import { useNavigate } from "react-router-dom";
import { CategoryBar } from "../AboutHeader/CategoryBar";
import { TopBanner } from "../AboutHeader/TopBanner";
import styles from './AskHome.module.css';

export default function AskHome(props) {
    
    const navigate = useNavigate();

    return(
        <div>
            <TopBanner />
            <CategoryBar />
            {/* 목록 */}
            <div className={styles.askList}>
                <div className={styles.askObject} onClick={()=>{
            console.log()}}>질문게시판</div>
                <div className={styles.askObject} onClick={()=>{}}>1:1 채팅</div>
                <div className={styles.askObject} onClick={()=>{}}>실시간 채팅</div>
            </div>
            {/* 해당 게시판 default값은 환영문구 페이지 */}

        </div>
    )
}