import styles from './Contact.module.css';

import { TopBanner } from "../TemplateLayout/AboutHeader/TopBanner"; // 최상단 배너
import { Footer } from "../TemplateLayout/AboutFooter/Footer"; // 최하단 배너
import { useData, useDataStore } from "../../Store/DataStore"; // zustand스토어 import
import { MenuData } from "../TemplateLayout/AboutMenuData/MenuData";


export function Contact(props) {

  //로그인 정보 불러오기
  return (
    <div>
      {/* -----START TOP----- */}
      <TopBanner iconHovered={props.iconHovered}
        iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave}
        icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle}
        category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick}
        menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} />
      {/* END TOP */}
      
      {/* -----START MIDDLE----- */}
      <div className={styles.middle}>
        {/* 메뉴바 */}
        <MenuData />

        {/* contentsContainer */}
        <div className={styles.contact_window}>
          <div className={styles.hello}>
            저희 성동 물산을 찾아주셔서 감사합니다.<br/>
            문의 사항은 아래의 문의처로 부탁드리겠습니다.<br/>
            감사합니다
          </div>
          <div className={styles.tell}>
            문의처 - 052)269-1840
          </div>
        </div>
      </div>
      {/* -----END MIDDLE----- */}

      {/* -----START BOTTOM----- */}
      <Footer />
      {/* -----END BOTTOM----- */}
    </div>
  )
}