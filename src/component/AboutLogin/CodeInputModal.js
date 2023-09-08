import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useNavigate } from 'react-router-dom';

export default function CodeInputModal(props) {
  


  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        props.onClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [props.onClose]);

  // 입력받을 코드
  const [inputCode, setInputCode] = useState('');

  // 입력코드 유효성 검사
  const confirmCode = () => {
    sessionStorage.getItem('savePrintCodeList');
  }


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { props.onClose() }}>
            <i className="fas fa-times"></i>
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
        <div className={styles.codeContainer}>
          <div className={styles.codeInputContainer}>
            <div className={styles.label}>
              발급 코드
            </div>
            <input
              className={styles.input}
              placeholder='ex)1C2A0523@1'
              value={inputCode}
              onChange={(e) => { setInputCode(e.target.value) }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  confirmCode();
                }
              }}
            />
          </div>
          {/* 회원가입 진행 Button */}
          <div
            className={styles.goProve}
            onClick={confirmCode}
          >
            인증하기
          </div>
        </div>
      </div>
    </div>
  );
}
