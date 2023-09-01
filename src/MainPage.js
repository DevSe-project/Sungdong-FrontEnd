import { CategoryBar } from './component/AboutHeader/CategoryBar';
import { SlideImg } from './component/AboutHeader/SlideImg';
import { TopBanner } from './component/AboutHeader/TopBanner';

export default function MainPage(props) {
  return (
    <div>
      {/* 최상단배너 */}
      <TopBanner login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicBarStyle={props.category_dynamicBarStyle} iconOnClick={props.iconOnClick} />
      {/* 클릭하면 나오는 카테고리바 */}
      <CategoryBar category_dynamicStyle={props.category_dynamicStyle}/>
      {/* 이벤트 등의 항목을 표시할 슬라이드이미지바 */}
      <SlideImg />

    </div>
  )
}