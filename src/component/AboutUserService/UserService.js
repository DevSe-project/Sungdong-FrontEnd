import { useNavigate, Outlet } from "react-router-dom";
import { TopBanner } from "../AboutHeader/TopBanner";
import styles from './UserService.module.css';
import { CategoryBar } from "../AboutHeader/CategoryBar";
import { useState } from "react";

export function UserService() {

    const serviceList = [
        {
            id : 0,
            serviceTitle : '공지사항',
            link : '/userservice/notice'
        },
        {
            id : 1,
            serviceTitle : '문의하기',
            link : '/userservice/ask    ',
        },
        
    ]
    
    const navigate = useNavigate();

    return(
        <div className={styles.body}>
            <TopBanner />
            <CategoryBar />
            <div className={styles.mainScreen}> {/*메인화면 가로정렬*/}
                <div className={styles.sideBar}> {/*사이드바 세로정렬*/}
                    <div className={styles.title} onClick={ () => {navigate('/userservice/')} }> 고객센터 </div>
                    {/* 목록 */}
                    <div className={styles.sideContents}>
                        { serviceList.map( (serviceList, index) => {
                            return <div className={styles.each_sideContents} key={index} onClick={ () => { 
                                navigate(`${serviceList.link}`);
                                } }>
                                {serviceList.serviceTitle}
                            </div>  
                        } ) }
                    </div>
                </div>
                {/* 해당 게시판을 보여줄 구멍 */}
                <div className={styles.mainComponent}>
                    {/* 처음 고객센터 인사말을 보여주고 사이드바의 개체를 선택하면 이동하는 식으로 구현할 예정 */}
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

