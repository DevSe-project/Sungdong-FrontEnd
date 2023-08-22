import styles from './WriteModal.module.css';
import { useNavigate } from 'react-router-dom';

export default function WriteModal(props) {

  

  const navigate = useNavigate();

  return (
    // 뒷배경 오버레이
    <div className={styles.modalOverlay}>
      {/* 글쓰기모달창 */}
      <div className={styles.modalWindow}>
        {/* X 버튼 */}
        <div className={styles.exit}>
          <span onClick={() => { props.setWriteState(!props.writeState) }}>
            <i class="fas fa-times"></i>
          </span>
        </div>
        {/* POST : 창 이름 */}
        <div className={styles.post}>문의하기</div>
        {/* 작성컨테이너 */}
        <div className={styles.inputContainer}>
          {/* 제목 */}
          <div className={styles.title}>
            <label className={styles.title_label} for="titleInput">제목 </label>
            <input className={styles.title_input} id='titleInput' />
          </div>
          {/* 내용 */}
          <div className={styles.content}>
            <label className={styles.content_label} for="contentInput">내용</label>
            <input className={styles.content_input} id='contentInput' />
          </div>
        </div>
        {/* 등록 */}
        <div className={styles.addButton}>
          등록
        </div>
      </div>
    </div>
  )
}