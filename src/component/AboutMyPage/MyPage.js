import { CategoryBar } from "../AboutHeader/CategoryBar";
import { TopBanner } from "../AboutHeader/TopBanner";

export default function MyPage(props) {

  return(
    <div>
      {/* 마이페이지 개설 예정 */}
      {/* 탑배너 & 카테고리 */}
      <TopBanner login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} text_dynamicStyle={props.text_dynamicStyle} />
      <CategoryBar category_dynamicStyle={props.category_dynamicStyle}/>
      {/* 내 정보(수정) */}
      {/* 장바구니목록 */}
      {/* 내가 찜한 목록 */}
      {/* 주문 / 배송 게시판 */}
    </div>
  )
}