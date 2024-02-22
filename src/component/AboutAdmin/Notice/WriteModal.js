import styles from "./WriteEditModal.module.css";
import { useEffect } from 'react';
import { useModalActions, useModalState, useNotice, useNoticeActions } from "../../../store/DataStore";


export default function WriteModal({ addPost }) {
    const { modalName } = useModalState();
    const { selectedModalClose } = useModalActions();

    const notice = useNotice();
    const { setNoticeData, resetNoticeData } = useNoticeActions();

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                selectedModalClose(modalName);
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [selectedModalClose]);



    return (
        <div className={styles.modalOveray}>
            <div className={styles.modalContainer}>
                {/* 종료 버튼 */}
                <div className={styles.closeButton}>
                    <span onClick={() => {
                        selectedModalClose(modalName);
                        resetNoticeData();
                    }}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                {/* 모달 */}
                {/* 모달 내용 컨테이너 */}
                <div className={styles.contentsContainer}>
                    {/* 제목 */}
                    <div className={styles.title}>
                        Title <input className={styles.inputTitle} type="text" value={notice.title} onChange={(e) => {
                            setNoticeData("title", e.target.value)
                        }} required />
                    </div>
                    {/* 작성자 */}
                    <div className={styles.writer}>
                        작성자 <input
                            className={styles.inputWriter}
                            type="text" value={notice.writer}
                            onChange={(e) => {
                                setNoticeData("writer", e.target.value)
                            }} required />
                    </div>
                    {/* 글 내용 */}
                    <div className={styles.content}>
                        <textarea
                            className={styles.textarea}
                            value={notice.contents}
                            onChange={(e) => {
                                setNoticeData("contents", e.target.value)
                            }}>
                        </textarea>
                    </div>
                </div>

                {/* 첨부파일 */}
                <div className={styles.addFiles}>
                    <input type="file" onChange={(e) => (
                        setNoticeData("files", e.target.value)
                    )} />
                </div>

                {/* 등록 버튼 */}
                <div className={styles.printPost} onClick={() => {
                    addPost();
                }}>
                    <div>등록</div>
                </div>
            </div>
        </div>
    );
}
