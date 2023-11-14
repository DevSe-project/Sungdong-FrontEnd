import styles from './MainPage.module.css'
import { SlideImg } from './component/AboutHome/SlideImg';
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { List } from './component/AboutHome/List';
import { MenuData } from './component/TemplateLayout/AboutMenuData/MenuData';
import { Footer } from './component/TemplateLayout/AboutFooter/Footer';
import NoticeMini from './component/AboutHome/NoticeMini';
export default function MainPage(props) {
  return (
    <div>
      {/* 최상단배너 */}
      <TopBanner data={props.data} setData={props.setData} 
      categoryData={props.categoryData} setCategoryData={props.setCategoryData} 
      login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} 
      iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} 
      icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} 
      category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick}
      menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle}/>
      <div className={styles.main}>
        <MenuData login={props.login} menu_dynamicStyle={props.menu_dynamicStyle}/>
        <div className="container">
          {/* 이벤트 등의 항목을 표시할 슬라이드이미지바 */}
          <div className={styles.slideImg}>
            <SlideImg />
          </div>
          <div>
            <NoticeMini />
          </div>
          <div>
            <List menu_dynamicStyle={props.menu_dynamicStyle}/>
          </div>
          <footer className='footer'>
              <Footer/>
          </footer>
        </div>
      </div>
    </div>
  )
}