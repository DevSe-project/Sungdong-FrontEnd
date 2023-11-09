import styles from './Contact.module.css';

import { TopBanner } from "../TemplateLayout/AboutHeader/TopBanner"; // 최상단 배너
import { Footer } from "../TemplateLayout/AboutFooter/Footer"; // 최하단 배너
import { useData, useDataStore } from "../../Store/DataStore"; // zustand스토어 import
import { MenuData } from "../TemplateLayout/AboutMenuData/MenuData";


export function Contact(props) {

  //로그인 정보 불러오기
  return (
    <div>
      {/* TOP */}
      <TopBanner iconHovered={props.iconHovered}
        iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave}
        icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle}
        category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick}
        menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} />

      {/* MIDDLE */}
      <div className={styles.middle}>
        {/* 메뉴바 */}
        <MenuData />
        
        {/* contentsContainer */}
        <div>
          문의처 - 052)269-1840
        </div>
      </div>

      {/* BOTTOM */}
      <Footer />
    </div>
  )
}