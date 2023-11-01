import styles from './NoticeDetail.module.css';
import { useEffect } from 'react';

export default function NoticeDetail(props) {

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                props.setIsModal(false); // "Esc" 키 누를 때 모달 닫기 함수 호출
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, []);

    // 선택된 index가 있을 때만 렌더링
    if (props.selectedItemIndex !== null && props.selectedItemIndex !== undefined) {
        return (
            <div className={styles.modalContainer}>
                {/* 종료 버튼 */}
                <div className={styles.closeButton}>
                    <span onClick={() => props.setIsModal(false)}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                {/* 본문 컨테이너 */}
                <div className={styles.contentContainer}>
                    {/* 제목 */}
                    <div className={styles.title}>
                        {props.list[props.selectedItemIndex].title}
                    </div>
                    {/* 작성일과 작성자 */}
                    <div className={styles.details}>
                        <div className={styles.date}>
                            작성일: {props.list[props.selectedItemIndex].date}
                        </div>
                        <div className={styles.writer}>
                            작성자: {props.list[props.selectedItemIndex].writer}
                        </div>
                    </div>
                    {/* 글 내용 */}
                    <div className={styles.content}>
                        {props.list[props.selectedItemIndex].contents}
                    </div>
                </div>
            </div>
        );
    } else {
        // selectedItemIndex가 없을 때 렌더링할 내용
        return null;
    }
}
