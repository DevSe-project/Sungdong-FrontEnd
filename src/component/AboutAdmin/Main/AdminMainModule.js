import { AdminMainListModule } from './AdminMainListModule'
import styles from './AdminMain.module.css'
export function AdminMainModule() {
  function depositIcon() {
    return <i style={{ fontSize: '2em', color: 'green' }} className="fas fa-won-sign"></i>
  }
  function cancelIcon() {
    return <i style={{ fontSize: '2em', color: 'lightBlue' }} className="fas fa-undo-alt"></i>
  }
  return (
    <div className={styles.main}>

      {/* -- Section_1 : 상단 */}
      <section className={styles.top}>

        {/* || Article_1 : 주문, 취소, 배송, 상품 */}
        <article className={styles.product}>
          {/* 입금 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule icon={depositIcon()} firstName={"입금대기"} secondName={"신규주문"} thirdName={"오늘출발"} />
          </div>

          {/* 취소 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule icon={cancelIcon()} firstName={"취소요청"} secondName={"반품요청"} thirdName={"교환요청"} />
          </div>

          {/* 배송 */}
          <div className={styles.productFull}>
            배송
          </div>

          {/* 상품 */}
          <div className={styles.productFull}>
            상품
          </div>
        </article>

        {/* || Article_2 : 공지사항 */}
        <article className={styles.notice}>
          공지사항
        </article>

      </section>

      {/* -- Section_2 : 하단 */}
      <section className={styles.bottom}>

        {/* || Article_1 : 방문자 수 통계 */}
        <article className={styles.visitor}>

        </article>

        {/* || Article_2 : 유저 */}
        <article className={styles.users}>

        </article>

      </section>

    </div>
  )
}