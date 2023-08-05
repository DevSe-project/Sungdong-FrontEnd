import { CategoryBar } from './CategoryBar'
import { TopBanner } from './TopBanner'
import styles from './LikeItem.module.css'
export function LikeItem(){
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <div className={styles.body}>
        <h1>관심 상품 리스트</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><input type='checkbox'/></th>
              <th>상품 이미지</th>
              <th className={styles.name}>상품명</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type='checkbox'/></td>
              <td><img src='../image/logo.jpeg' alt='이미지'/></td>
              <td>상품이름</td>
              <td>\10000</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.buttonDiv}>
          <button className={styles.deletebutton}>제거</button>
          <button className={styles.button}>장바구니에 추가</button>
        </div>
      </div>
    </div>
  )
}