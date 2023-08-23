import styles from './TodayNewsCard.module.css'
import image from '../../image/page_ready.png'
export function TodayNewsCard(){
  return(
    <main className={styles.body}>
      <div className={styles.contentsContainer}>
        <div className={styles.contentsBox}>
          <img src={image} alt='이미지' width='370px' height='400px'/>
          <div style={{
            marginTop:'2em',
            height: '3em'
            }}>
            <h4 style={{fontWeight:'650'}}>제목</h4>
          </div>
          <div style={{
            marginBottom:'2em',
            height: '6em',
          }}>
            <p>내용</p>
          </div>
          <div className={styles.contentsBox_footer}>
            <span>관리자 | 날짜~</span>
            <p>댓글 개수</p>
          </div>
        </div>
      </div>
    </main>
  )
}