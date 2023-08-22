import { useNavigate } from 'react-router-dom'
import { OrderObj } from '../Data/OrderObj'
import styles from './Delivery.module.css'
export function Delivery(){
  const navigate = useNavigate();
  return(
    <div className={styles.container}>
      {OrderObj.map((item)=> 
      <div className={styles.deliveryList}>
        <div className={styles.orderDate}>
          <h4>{item.date} 주문</h4>
          <div className={styles.orderDetail}>
            <span>주문 상세보기</span>
            <i className="far fa-chevron-right"></i>
          </div>
        </div>
        <div className={styles.deliveryStyle}>
          <div className={styles.deliveryNow}>
            <div className={styles.deliveryNowMenu}>
              <h5>배송상태</h5>
              <i style={{color: '#ccc'}} className="fas fa-trash-alt"></i>
            </div>
            <div className={styles.deliveryNowItem}>
              <img className={styles.img} src='../../image/logo.jpeg' alt="주문상품"/>
              <div className={styles.deliveryNowInformation}>
                <span>{item.productName}, {item.cnt}개</span>
                <span>{item.cnt * item.price}원</span>
              </div>
            </div>
          </div>
          <div className={styles.deliveryMenu}>
            <button className={styles.button}>배송 조회</button>
            <button className={styles.button}>교환, 반품 신청</button>
            <button onClick={()=>navigate(`/review/${item.id}`)} className={styles.button}>리뷰 작성하기</button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}