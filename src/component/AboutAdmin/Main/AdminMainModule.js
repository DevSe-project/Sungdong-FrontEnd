import { AdminDepositModule } from './AdminDepositModule'
import styles from './AdminMain.module.css'
export function AdminMainModule(){
  return(
    <div className={styles.main}>
    {/* 상위 컴포넌트 부분 */}
    <section className={styles.top}>
      {/* 주문, 취소, 배송, 상품 */}
      <article className={styles.product}>
        {/* 입금 */}
        <div className={styles.productSeparate}>
          <AdminDepositModule/>
        </div>
        {/* 취소 */}
        <div className={styles.productSeparate}>
          <AdminDepositModule/>
        </div>
        {/* 배송 */}
        <div className={styles.productFull}>
        </div>
        {/* 상품 */}
        <div className={styles.productFull}>

        </div>
      </article>
      {/* 공지사항 */}
      <article className={styles.notice}>
        
      </article>
    </section>
    {/* 하위 컴포넌트 부분 */}
    <section className={styles.bottom}>
      {/* 방문자 수 통계 */}
      <article className={styles.visitor}></article>
      {/* 유저 */}
      <article className={styles.users}></article>
    </section>
  </div>
  )
}