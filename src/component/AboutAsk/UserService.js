import { useNavigate, Outlet } from "react-router-dom";
import { TopBanner } from "../AboutHeader/TopBanner";
import styles from './UserService.module.css';
import { CategoryBar } from "../AboutHeader/CategoryBar";

export default function UserService() {

    const serviceList = [
        {
            id : 0,
            serviceTitle : '질문 게시판',
            link : '/userservice/questions'
        },
        {
            id : 1,
            serviceTitle : '1:1 서비스',
            link : '/userservice/eachservice',
        },
        {
            id : 2,
            serviceTitle : '실시간 채팅',
            link : '/userservice/livechat',
        },
        
    ]
    
    const navigate = useNavigate();

    return(
        <div className={styles.body}>
            <TopBanner />
            <CategoryBar />
            <div className={styles.mainScreen}>{/*메인화면 가로정렬*/}
            
                <div className={styles.sideBar}> {/*사이드바 세로정렬*/}
                    <div className={styles.title}> 고객센터 </div>
                    {/* 목록 */}
                    <div className={styles.sideContents}>
                        { serviceList.map( (serviceList, index) => {
                            return <div key={index} onClick={ () => { navigate(`${serviceList.link}`) } }>
                                {serviceList.serviceTitle}
                            </div>  
                        } ) }
                    </div>
                </div>
                {/* 해당 게시판을 보여줄 구멍 */}
                <div className={styles.mainComponent}>
                    <Outlet />
                </div>
            </div>

        </div>
    )
}