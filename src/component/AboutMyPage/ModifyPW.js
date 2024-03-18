import { React, useEffect, useState } from 'react';
import styles from './ModifyPW.module.css';
import { useDataActions, useModal, useModalActions, useUserData } from '../../store/DataStore';
import { useCheck } from '../../customFn/useChecking';

export default function ModifyPW(props) {

  const { closeModal } = useModalActions(); // Modal
  const { handleItemChecking, handleInputLength } = useCheck();


  // 현재비번, 재설정비번, 재설정비번확인 Input
  const [inputForModify, setInputForModify] = useState({
    now_password: null,
    re_password: null,
    confirm_re_password: null
  })


  // enter키를 누르면 'PW찾기'
  /**
   * Input 내부에서 'Enter'키를 누를 시, goModify()가 실행되도록 함
   * @param {*} event 
   * @returns goModify()
   */
  function handleEnter_pwFind(event) {
    if (event.key === 'Enter') {
      goModify();
    }
  }

  /** 
   * input 값에 따른 스타일 변경에 필요한 함수 
   * */
  function handleStyle() {
    return handleInputLength(inputForModify.confirm_re_password) && handleItemChecking(inputForModify.re_password, inputForModify.confirm_re_password) ? 'rgb(240, 255, 230)' : 'lightgray'
  }

  // 비밀번호 변경 실행함수
  function goModify() {
    
  }

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        closeModal(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [closeModal]);


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.exitButton}>
          <span onClick={closeModal}>
            <i class="fas fa-times"></i>
          </span>
        </div>
        <div className={styles.modalContent}>
          {/* Title */}
          <div className={styles.titleBox}>
            <div className={`${styles.title}`}>
              비밀번호 수정
            </div>
          </div>

          <div className={styles.contents_container}>
            <div className={styles.pw_layout}>
              <div className={styles.inputContainer}>
                <div className={styles.label}>현재 <br />비밀번호</div>
                <input
                  className={styles.input}
                  type='password'
                  placeholder='현재 비밀번호를 입력'
                  value={inputForModify.now_password}
                  onChange={(e) => {
                    const inputPassword = {
                      ...inputForModify,
                      now_password: e.target.value
                    }
                    setInputForModify(inputPassword);
                  }}
                  onKeyDown={handleEnter_pwFind}
                />
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.label}>재설정 <br />비밀번호</div>
                <input
                  className={styles.input}
                  type='password'
                  placeholder='재설정할 비밀번호 입력'
                  value={inputForModify.re_password}
                  onChange={(e) => {
                    const inputCeoName = {
                      ...inputForModify,
                      re_password: e.target.value
                    };
                    setInputForModify(inputCeoName);
                  }}
                  onKeyDown={handleEnter_pwFind}
                  style={{ backgroundColor: handleStyle() }}
                />
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.label}>재설정 <br />비밀번호 <br />확인</div>
                <input
                  className={styles.input}
                  type='password'
                  placeholder='재설정할 비밀번호 확인'
                  value={inputForModify.confirm_re_password}
                  onChange={(e) => {
                    const inputbiz_num = {
                      ...inputForModify,
                      confirm_re_password: e.target.value
                    };
                    setInputForModify(inputbiz_num);
                  }}
                  onKeyDown={handleEnter_pwFind}
                  style={{ backgroundColor: handleStyle() }}
                />
              </div>
            </div>
            <div
              className={styles.goModify}
              onClick={() => { }}>
              비밀번호<br />
              변경하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}