import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { Delivery } from './Delivery'
import styles from './DeliveryMain.module.css'
export function DeliveryMain(){
  return(
    <div>
      <TopBanner/>  
      <CategoryBar/>
      <div className={styles.container}>
        <h1>주문 목록</h1>
        <div className={styles.searchInputContainer}>
          <input className={styles.searchInput} type='text' placeholder='주문한 상품 검색하기'/>
          <i className="fas fa-search"/>
        </div>
      </div>
      <Delivery/>
    </div>
  )
}