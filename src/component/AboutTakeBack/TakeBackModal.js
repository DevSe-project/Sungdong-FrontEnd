import styles from './Modal.module.css';
import { useEffect } from 'react';
import { useModal, useNoticePostList } from '../../Store/DataStore';

export default function TakeBackModal() {
    const {closeModal} = useModal();

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, [closeModal]);

    return (
        <div className={styles.modalContainer}>
            {/* 종료 버튼 */}
            <div className={styles.closeButton}>
                <span onClick={() => closeModal()}>
                    <i className="fas fa-times"></i>
                </span>
            </div>
            {/* 본문 컨테이너 */}
            <div className={styles.contentContainer}>
                {/* 제목 */}
                <div className={styles.title}>
                    반품증 작성 작업
                </div>
                {/* 작성일과 반품상담자 */}
                <div className={styles.details}>
                    <div className={styles.date}>
                        작성일: 
                    </div>
                    <div className={styles.writer}>
                        반품상담자: 성동물산(주)
                    </div>
                </div>
                {/* 글 내용 */}
                <div className={styles.contentsBox}>
                    <div className={styles.contents}>
                        일단 나눠보자.
                    </div>
                </div>
            </div>
        </div>
    );
}
