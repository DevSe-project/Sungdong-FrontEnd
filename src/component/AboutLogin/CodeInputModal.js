import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';

export default function CodeInputModal({ onClose }) {


  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        onClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, []);


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.exitButton}>
          <span onClick={() => { onClose() }}>
            <i class="fas fa-times"></i>
          </span>
        </div>
        {/* Title */}
        <div className={styles.modalContent}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              회원가입 코드 인증
            </div>
          </div>
        </div>
        {/* 코드입력란 */}
        <div className={styles.codeInputContainer}>
          <label className={styles.codeInputLabel}>
            회원가입 코드 :
            <input
              className={styles.codeInput}
              value='aaaa'
              onChange={ () => {} }
            />
          </label>
        </div>
        {/* 회원가입 진행 Button */}
        <div>
          인증하기
        </div>
      </div>
    </div>
  );
}
