import { SlideImg } from './component/AboutHome/SlideImg';
import { TopBanner } from './component/TemplateLayout/AboutHeader/TopBanner';
import { List } from './component/AboutHome/List';

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
      {/* 이벤트 등의 항목을 표시할 슬라이드이미지바 */}
      <SlideImg />
      <List data={props.data}/>

    </div>
  )
}