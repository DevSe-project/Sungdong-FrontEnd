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
}, );

    return (
        <div className={styles.detailContainer}>
            제목 : {props.list[0].title}
        </div>
    )
}