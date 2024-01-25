import styles from './MainPage.module.css'
import { SlideImg } from './component/AboutHome/SlideImg';
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';
import NoticeMini from './component/AboutHome/NoticeMini';
import { Product } from './component/AboutHome/Product';
import WelcomeModule from './component/WelcomeModule/WelcomeModule';
export default function MainPage(props) {
  return (
    <div className={styles.body}>

      {/* TOP */}
      <TopBanner
        iconHovered={props.iconHovered}
        iconMouseEnter={props.iconMouseEnter}
        iconMouseLeave={props.iconMouseLeave}
        icon_dynamicStyle={props.icon_dynamicStyle}
        text_dynamicStyle={props.text_dynamicStyle}
        category_dynamicStyle={props.category_dynamicStyle}
        iconOnClick={props.iconOnClick}
        menuOnClick={props.menuOnClick}
        menu_dynamicStyle={props.menu_dynamicStyle} />
        
        <div className={styles.flexBox}>
          {/* ❗️----SIDE----❗️ */}
          <div className={styles.left}>
            {/* 로그인이 돼있다면 모듈 표시 */}
            {/* { GetCookie('jwt_token') !== null ? <MyInfoSummary /> : null } */}
            
            
            {/* 서버 연동 전 모듈 항시표시 - 확인용 */}
            <WelcomeModule />
            
            
            <MenuData login={props.login} menu_dynamicStyle={props.menu_dynamicStyle} />
          </div>
          {/* ❗️----CENTER----❗️ */}
          <div className={styles.center}>
            {/* 슬라이드 이미지 2개 */}
            <div className={styles.slideImg_container}>
              <SlideImg />
            </div>
            {/* 상품 목록 Grid */}
            <div className={styles.product_container}>
              <Product />
            </div>
          </div>
          {/* ❗️----RIGHT----❗️ */}
          <div className={styles.right}>
            <NoticeMini />
          </div>
      </div>

      {/* FOOTER */}
      <footer className='footer'>
        <Footer />
      </footer>

    </div>
  )
}