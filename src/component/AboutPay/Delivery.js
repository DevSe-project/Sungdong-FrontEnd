import styles from './Delivery.module.css'
export function Delivery(){
  return(
    <div className={styles.container}>
      <div className={styles.deliveryList}>
        <div className={styles.orderDay}>
          <h4>23. 02. 08. 주문</h4>
          <div className={styles.orderDayDiv}>
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
                <span>상품이름, n개</span>
                <span>n원, n개</span>
              </div>
            </div>
          </div>
          <div className={styles.deliveryMenu}>
            <button className={styles.button}>배송 조회</button>
            <button className={styles.button}>교환, 반품 신청</button>
            <button className={styles.button}>리뷰 작성하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}