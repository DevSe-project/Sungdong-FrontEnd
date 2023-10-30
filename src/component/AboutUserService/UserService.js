import { useNavigate, Outlet } from "react-router-dom";
import { TopBanner } from "../AboutHeader/TopBanner";
import styles from './UserService.module.css';

export function UserService(props) {

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
            {/* TopBanner */}
            <TopBanner menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
            {/*메인화면 가로정렬*/}
            <div className={styles.mainScreen}>
                
                {/* 우측 : 해당 게시판을 보여줄 구멍 */}
                <div className={styles.mainComponent}>
                    {/* 처음 고객센터 인사말을 보여주고 사이드바의 개체를 선택하면 이동하는 식으로 구현할 예정 */}
                    <Outlet />
                </div>
            </div>

        </div>
    )
}

