import React from 'react';
import styles from './FindModal.module.css';

export default function FindModal({ type, onClose }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                    {/* 아이디 비번 선택란 */}
                    <div className={styles.title}>아이디 찾기</div>
                    <div className={styles.title}>비밀번호 찾기</div>
                    {/*  */}


                </div>
                <div className={styles.closeButton} onClick={onClose}>닫기</div>
            </div>
        </div>
    );
}