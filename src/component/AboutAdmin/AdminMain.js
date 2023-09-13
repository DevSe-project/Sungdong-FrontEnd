import styles from './AdminMain.module.css'
export function AdminMain() {
  return (
    <div className={styles.main}>
      {/* 상품 관리 */}
      <div className={styles.productManage}>

      </div>
      {/* 배송 관리 */}
      <div className={styles.deliveryManage}>

      </div>
      {/* 수익 관리 */}
      <div className={styles.benefitManage}>

      </div>
      {/* 고객요청 관리 */}
      <div className={styles.claimManage}>

      </div>
      {/* 고객 관리 */}
      <div className={styles.userManage}>

      </div>
      {/* 리뷰 관리 */}
      <div className={styles.reviewManage}>

      </div>
    </div>
  )
}