import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/DataStore';

export default function CodeInputModal(props) {

  const {userData, setUserData} = useDataStore();

  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        props.closeModal(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [props.closeModal]);

  // 인증코드 입력 state
  const [inputCode, setInputCode] = useState('');
  // 유효코드인증API
  const confirmCode = () => {
    const calledCodeList = JSON.parse(sessionStorage.getItem('savePrintCodeList')) || []; // 코드 리스트를 불러오고, 없을 경우 빈 배열로 초기화
    const matchedCode = calledCodeList.find(codeItem => codeItem.code === inputCode); //매칭되는 코드를 찾음
    if (matchedCode) { // 일치하는 코드가 발견된 경우
      sessionStorage.setItem('saveAllowAccess', JSON.stringify(true)); //세션에 해당상태 저장
      navigate('/join'); // 1. 회원가입 페이지로 이동
      // 2. userData의 id값으로 입력받은 코드를 삽입
    } else { //코드일치X -> 접근권한 false -> 경고창
      sessionStorage.setItem('saveAllowAccess', JSON.stringify(false)); //세션에 해당상태 저장
      alert('유효하지 않은 코드입니다.');
    }
  }


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { props.closeModal() }}>
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
