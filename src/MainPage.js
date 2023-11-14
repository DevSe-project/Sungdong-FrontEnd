import styles from './MainPage.module.css'
import { SlideImg } from './component/AboutHome/SlideImg';
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { List } from './component/AboutHome/List';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';
import NoticeMini from './component/AboutHome/NoticeMini';
export default function MainPage(props) {
  return (
    <div className={styles.body}>

      {/* TOP */}
      <TopBanner data={props.data} setData={props.setData}
        categoryData={props.categoryData} setCategoryData={props.setCategoryData}
        login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered}
        iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave}
        icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle}
        category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick}
        menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} />

      {/* MAIN */}
      <div className={styles.main}>

        {/* ❗️----LEFT----❗️ */}
        <div className={styles.left}>
          <MenuData login={props.login} menu_dynamicStyle={props.menu_dynamicStyle} />
        </div>

        {/* ❗️----CENTER----❗️ */}
        <div className="center">
          
          <div className={styles.slideImg}>
            <SlideImg />
          </div>
          
          <div>
            <List menu_dynamicStyle={props.menu_dynamicStyle} />
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