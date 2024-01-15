
import { useState, useEffect } from 'react';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './ModalStyles.module.css';


export default function InvoiceModal(props) {

    const { isModal } = useModalState();
    const { selectedModalClose } = useModalActions();



    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                selectedModalClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출;
            }
        };

        window.addEventListener('keydown', exit_esc);

        return () => {
            window.removeEventListener('keydown', exit_esc);
        };
    }, [selectedModalClose]);



    return (
        <div className='modalOverlay'>
            <div className='modalContainer'>
                <div
                    className='exitButton'
                    onClick={() => { selectedModalClose() }}>
                    <i className="fas fa-times"></i>
                </div>

                <div className={styles.modalTitle}>송장 수정</div>

                <div className={styles.contents}>
                    컨텐츠
                </div>
            </div>
        </div>
    )
}