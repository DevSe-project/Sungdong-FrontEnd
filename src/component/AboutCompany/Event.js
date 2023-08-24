import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import styles from './Event.module.css'
export function Event(){
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>진행중인 이벤트</h1>
        </div>
      </main>
    </div>
  )
}