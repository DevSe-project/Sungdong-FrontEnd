import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { Delivery } from './Delivery'
import styles from './DeliveryMain.module.css'
export function DeliveryMain(props){
  return(
    <div>
      <TopBanner login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>주문 목록</h1>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <input className={styles.searchInput} type='text' placeholder='주문한 상품 검색하기'/>
            <i className="fas fa-search"/>
          </div>
        </div>
      </div>
      <Delivery orderData={props.orderData}/>
    </div>
  )
}