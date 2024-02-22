import styles from './WriteEditModal.module.css';
import { useEffect } from 'react';
import { useModalActions, useModalState, useNotice, useNoticeActions } from "../../../store/DataStore";

export default function EditModal({handleConfirmSD}) {
    // call_modalZustand
    const { modalName } = useModalState();
    const { selectedModalClose } = useModalActions();

    const notice = useNotice();
    const {setNoticeData, resetNoticeData} = useNoticeActions();

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

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.closeButton}>
                    <span onClick={()=>{
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
                            name="title"
                            value={notice.title}
                            onChange={(e)=>setNoticeData("title", e.target.value)}
                        />
                    </div>
                    {/* Writer */}
                    <div className={styles.writer}>
                        작성자
                        <input
                            className={styles.inputWriter}
                            type="text"
                            name="writer"
                            value={notice.writer}
                            onChange={(e)=>setNoticeData("writer", e.target.value)}
                        />
                    </div>
                    {/* Contents */}
                    <div className={styles.content}>
                        <textarea
                            className={styles.textarea}
                            name="contents"
                            value={notice.contents}
                            onChange={(e)=>setNoticeData("contents", e.target.value)}
                        />
                    </div>
                </div>

                {/* add Files */}
                <div>
                    <input type="file" onChange={() => { }} />
                </div>

                {/* Save Button */}
                <div className={styles.buttonContainer}>
                    <div className={styles.printPost} onClick={()=>handleConfirmSD()}>
                        <div>저장</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
