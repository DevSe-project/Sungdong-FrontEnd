import styles from './WriteEditModal.module.css';
import { useEffect, useState } from 'react';
import { useModalActions, useModalState, useNotice, useNoticeActions } from "../../../store/DataStore";

export default function EditModal({ handleUpdate, item }) {
  const { modalName } = useModalState();
  const { selectedModalClose } = useModalActions();

  const notice = useNotice();
  const [matchedPostData, setMatchedPostData] = useState(item);
  const { setNoticeData, resetNoticeData } = useNoticeActions();
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName);
        resetNoticeData();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedModalClose]);

  // 불러들인 item을 변경할 수 있도록 새로운 state에 담습니다.
  useEffect(() => {
    setMatchedPostData(item);
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMatchedPostData({
      ...matchedPostData,
      [name]: value
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.closeButton}>
          <span onClick={() => {
            selectedModalClose(modalName);
            resetNoticeData();
          }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        <div className={styles.contentsContainer}>
          {/* Title */}
          <div className={styles.title}>
            Title
            <input
              className={styles.inputTitle}
              type="text"
              name="post_title"
              value={matchedPostData.post_title}
              onChange={e => handleInputChange(e)}
            />
          </div>
          {/* Writer */}
          <div className={styles.writer}>
            작성자
            <input
              className={styles.inputWriter}
              type="text"
              name="post_writer"
              value={matchedPostData.post_writer}
              onChange={e => handleInputChange(e)}
            />
          </div>
          {/* Contents */}
          <div className={styles.content}>
            <textarea
              className={styles.textarea}
              name="post_content"
              value={matchedPostData.post_content}
              onChange={e => handleInputChange(e)}
            />
          </div>
        </div>

        {/* Add Files */}
        <div>
          <input type="file" onChange={() => { }} />
        </div>

        {/* Save Button */}
        <div className={styles.buttonContainer}>
          <div className={styles.printPost} onClick={() => {handleUpdate(matchedPostData)}}>
            <div>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
}