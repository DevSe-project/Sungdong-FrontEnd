import '../App.css'
import styles from './CategoryBar.module.css'

export default function() {
  
// 전체 레이아웃 완성 후 state로 category name을 가변적으로 할 예정
  return(
    <div>
      <div className={styles.categoryBarContainer}>
        <div className={styles.category}>생활/건강</div>
        <div className={styles.category}>디지털/가전</div>
        <div className={styles.category}>스포츠/레저</div>
        <div className={styles.category}>패션의류</div>
        <div className={styles.category}>패션잡화</div>
      </div>
    </div>
  )
}