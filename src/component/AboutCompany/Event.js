import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner'
import image from '../.././image/page_ready.png'
import styles from './Event.module.css'
export function Event(){
  return(
    <div>
      <main className={styles.head}>
        <div className={styles.title}>
          <h1>진행중인 이벤트</h1>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <div className={styles.contentBody}>
              <img src={image} alt="이미지"/>
              <div className={styles.text}>
                <h1>진행중인 이벤트 타이틀</h1>
                <h4>진행중인 이벤트 내용</h4>
              </div>
            </div>
            <div className={styles.contentFooter}>
              <p>자세한 문의는 여기로 연락바람</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}