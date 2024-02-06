import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useNavigate } from 'react-router-dom';
import { useDataActions, useModal, useModalActions, useUserData } from '../../Store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';

export default function CodeInputModal() {
  const userData = useUserData();
  const { setUserData } = useDataActions();
  const { selectedModalClose, closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { fetchNonPageServer } = useFetch();

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
    const result = await fetchNonPageServer({ user_code: inputCode }, `post`, `/auth/checkCode`, 1);
    return result;
  };

  // 인증코드 입력 state
  const [inputCode, setInputCode] = useState('');
  const { mutate: checkCodeMutation } = useMutation({ mutationFn: fetchCheckCode })

  // 유효코드 체크
  const confirmCode = () => {
    checkCodeMutation(inputCode, {
      onSuccess: (data) => {
        console.log('유효한 코드 :', data);
        alert(data.message);
        closeModal();
        navigate("/join");
      },
      onError: (error) => {
        closeModal();
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
            onClick={() => confirmCode()}
          >
            인증하기
          </div>
        </div>
      </div>
    </div>
  );
}
