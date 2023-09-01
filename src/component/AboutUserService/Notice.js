import styles from './Notice.module.css';
import { NoticeObj } from './Notice.module.css';

export function Notice() {

  return(
    <div className={styles.noticeContainer}>
      {/* 공지사항 */}
      <div className={styles.post}>
        공지사항
      </div>
      {/* 검색창 */}
      <div>
        <input />
      </div>
      {/* 글목록 */}
    </div>
  )
}