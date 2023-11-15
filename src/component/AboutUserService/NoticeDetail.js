import styles from './NoticeDetail.module.css';
import { useEffect } from 'react';
import { useModal, useNoticePostList } from '../../Store/DataStore';

export default function NoticeDetail() {
    const {setIsModal, selectedIndex, isModal, setSelectedIndex} = useModal();
    const noticePostList = useNoticePostList();

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                setIsModal(false);
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, [setIsModal]);

    // 선택된 index가 있을 때만 렌더링
    if (selectedIndex !== null && selectedIndex !== undefined) {
        return (
            <div className={styles.modalContainer}>
                {/* 종료 버튼 */}
                <div className={styles.closeButton}>
                    <span onClick={() => setIsModal(false)}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                {/* 본문 컨테이너 */}
                <div className={styles.contentContainer}>
                    {/* 제목 */}
                    <div className={styles.title}>
                        {noticePostList[selectedIndex].title}
                    </div>
                    {/* 작성일과 작성자 */}
                    <div className={styles.details}>
                        <div className={styles.date}>
                            작성일: {noticePostList[selectedIndex].date}
                        </div>
                        <div className={styles.writer}>
                            작성자: {noticePostList[selectedIndex].writer}
                        </div>
                    </div>
                    {/* 글 내용 */}
                    <div className={styles.contentsBox}>
                        <div className={styles.contents}>
                            {noticePostList[selectedIndex].contents}
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
