import { TopBanner } from '../AboutHeader/TopBanner'
import image from '../.././image/page_ready.png'
import styles from './Event.module.css'
export function Event(props){
  return(
    <div>
      <TopBanner data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} />
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