import image from '../image/page_ready.png'
import logo from '../image/logo.jpeg'
import styles from './SlideImg.module.css'
export function SlideImg() {
  return(
    <div className={styles.over}> 
      <div className={styles.headDiv}>
        <div className={styles.div}>
          <img src={image} alt='이미지'/>
        </div>
        <div className={styles.div}>
          <img src={logo} alt='이미지'/>
        </div>
        <div className={styles.div}>
          <img src={image} alt='이미지'/>
        </div>
      </div>
      <ul>
          <li 
          className='movingleft'
          >
            왼쪽으로 이동
          </li>
          <li
          className='movingright'
          >
            오른쪽으로 이동
          </li>
        </ul>
    </div>
  )
}