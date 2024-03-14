import styles from './NoticeDetail.module.css';
import { useEffect } from 'react';
import { useModalActions, useModalState, useNoticePostList } from '../../store/DataStore';

export default function NoticeDetail() {
    const { selectedIndex } = useModalState();
    const { selectedModalClose } = useModalActions();
    const noticePostList = useNoticePostList();

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                selectedModalClose();
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, [selectedModalClose]);

    // 선택된 index가 있을 때만 렌더링
    if (selectedIndex !== null && selectedIndex !== undefined) {
        return (
            <div className={styles.modalContainer}>
                {/* 종료 버튼 */}
                <div className={styles.closeButton}>
                    <span onClick={() => selectedModalClose()}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                {/* 본문 컨테이너 */}
                <div className={styles.contentContainer}>
                    {/* 제목 */}
                    <div className={styles.title}>
                        {noticePostList.post_title}
                    </div>
                    {/* 작성일과 작성자 */}
                    <div className={styles.details}>
                        <div className={styles.date}>
                            작성일: {new Date(noticePostList.post_date).toLocaleDateString()}
                        </div>
                        <div className={styles.writer}>
                            작성자: {noticePostList.post_writer}
                        </div>
                    </div>
                    {/* 글 내용 */}
                    <div className={styles.contentsBox}>
                        <div className={styles.contents}>
                            {noticePostList.post_content}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // selectedItemIndex가 없을 때 렌더링할 내용
        return null;
    }
}
