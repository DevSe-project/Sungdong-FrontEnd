import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState } from '../../../Store/DataStore';

export default function AdminCancelModal() {

  const { modalName } = useModalState();
  const {selectedModalOpen, selectedModalClose} = useModalActions();


  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { selectedModalClose(modalName) }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        {/* Title */}
        <div className={styles.modalContent}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              {modalName} 처리
            </div>
          </div>
        </div>
        {/* 주문자 정보 */}
        <div className={styles.codeContainer}>

        </div>
      </div>
    </div>
  );
}
