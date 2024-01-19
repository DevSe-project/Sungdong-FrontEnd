import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { useDataActions, useModal, useModalActions, useUserData } from '../../Store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../axios';

export default function CodeInputModal() {
  const userData = useUserData();
  const { setUserData } = useDataActions();
  const { selectedModalClose, closeModal } = useModalActions();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);

    //코드 데이터 생성 fetch
    const fetchCheckCode = async (inputCode) => {
      try {
      const response = await axios.post("/auth/checkCode",
          JSON.stringify({
            user_code: inputCode
          }),
          {
            credentials: 'include', // withCredentials: true 와 같은 효과
            headers: {
                "Content-Type": "application/json",
            }
          }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
  } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('확인 중 오류가 발생했습니다.');
  }
  };

  // 인증코드 입력 state
  const [inputCode, setInputCode] = useState('');
  const {mutate:checkCodeMutation} = useMutation({mutationFn: fetchCheckCode})

  // 유효코드 체크
  const confirmCode = () => {
    checkCodeMutation(inputCode,{
      onSuccess: (data) => {
        console.log('유효한 코드 :', data);
        alert(data.message);
        navigate("/join");        
      },
      onError: (error) => {
        console.error('code check failed:', error);
        // 에러 처리 또는 메시지 표시
      },
    });
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { closeModal() }}>
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
            onClick={()=>confirmCode()}
          >
            인증하기
          </div>
        </div>
      </div>
    </div>
  );
}
