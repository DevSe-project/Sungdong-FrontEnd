import styles from './Modal.module.css';
import { useEffect } from 'react';
import { useModalActions } from '../../Store/DataStore';

export default function TakeBackModal() {
    const {closeModal} = useModalActions();

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

    const productList = [
        { label : '상품정보', content : '상품정보입니다.'},
        { label : '배송구분', content : '배송구분입니다.'},
        { label : '승인시간', content : '배송구분입니다.'},
        { label : '판매일자', content : '배송구분입니다.'},
        { label : '전표번호', content : '배송구분입니다.'},
        { label : '경과일', content : '배송구분입니다.'},
      ]


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
                        <div className={styles.productInfo}>
                            {productList.map((item,key) => 
                            <div className={styles.pleft}>
                                <div className={styles.label}>
                                    {item.label}
                                </div>
                                <div className={styles.content}>
                                    {item.content}
                                </div>
                            </div>
                            )}
                            <div className={styles.pright}>
                                <div className={styles.label}>
                                </div>
                                <div className={styles.content}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
