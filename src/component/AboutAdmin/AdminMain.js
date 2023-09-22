import { AdminHeader } from './AdminHeader'
import { AdminMenuData } from './AdminMenuData'
import styles from './AdminMain.module.css'
export function AdminMain() {
  return (
    <div className={styles.main}>
      <AdminHeader/>
      <div className={styles.body}>
        <AdminMenuData/>
        <div className={styles.bodyTile}>
          {/* 상품 관리 */}
          <div className={styles.bodyInnerTile}>
            상품관리 타일형
          </div>
          {/* 배송 관리 */}
          <div className={styles.bodyInnerTile}>
            배송관리 타일형
          </div>
          {/* 수익 관리 */}
          <div className={styles.bodyInnerTile}>
            수익관리 타일형
          </div>
          {/* 고객요청 관리 */}
          <div className={styles.bodyInnerTile}>
            고객요청 타일형
          </div>
          {/* 고객 관리 */}
          <div className={styles.bodyInnerTile}>
            고객관리 타일형
          </div>
        </div>
        <div className={styles.leftSideBar}>
          사이드바 내용
        </div>
      </div>
    </div>
  )
}