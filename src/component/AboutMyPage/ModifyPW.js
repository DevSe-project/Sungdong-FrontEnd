import { React, useEffect, useState } from 'react';
import styles from './ModifyPW.module.css';
import { useModalActions, useRegexActions, useRegexItems } from '../../store/DataStore';
import { useCheck } from '../../customFn/useChecking';
import { useFetch } from '../../customFn/useFetch';
import { useMutation } from '@tanstack/react-query';

export default function ModifyPW(props) {

  const { closeModal } = useModalActions(); // Modal
  const { handleItemChecking, handleInputLength } = useCheck();
  const { fetchNonPageServer } = useFetch();
  const { passwordRegex } = useRegexItems();
  const { testRegex } = useRegexActions();

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

  /** 비밀번호 변경에 필요한 조건 모음 */
  const modifyConditions = handleInputLength(inputForModify.confirm_re_password) &&
    handleItemChecking(inputForModify.re_password, inputForModify.confirm_re_password) &&
    testRegex(passwordRegex, inputForModify.re_password);
  /** <input /> 값에 따른 스타일 변경에 필요한 함수 
   * 조건1 : 두 <input />에 값이 존재
   * 조건2 : 두 <input />의 값이 일치
   * 조건3 : 둘 중 하나의 <input />의 값이 passwordRegex(비밀번호 정규식)에 적합
   * @use <input />의 style 속성에서 사용됩니다.
   * @returns 조건 부합 시 : rgb(240, 255, 230)
   * @returns 조건 불합 시 : lightgray
   * */
  function handleStyle() {
    if (modifyConditions) {
      return 'rgb(240, 255, 230)';
    } else {
      return 'lightgray';
    }

  }

  /** Step_1. 비밀번호 변경 실행함수 */
  function goModify() {
    if (modifyConditions) { // 조건에 부합?
      // Mutation 호출
      updateMutation(inputForModify, {
        onSuccess: (data) => { // 수정 성공 시
          console.log(`비밀번호 수정이 완료되었습니다: ${JSON.stringify(data.data)}`);
          alert(data.message);
          closeModal();
        },
        onError: (error) => { // 수정 실패 시
          console.log(`비밀번호 수정에 실패했습니다: ${JSON.stringify(error)}`);
          alert(error.message);
        }
      });
    } else {
      alert(`다음 조건이 부합한지 확인해주세요 !
        1. 현재 비밀번호를 맞게 입력하셨습니까?
        2. 두 비밀번호가 일치합니까?
        3. 비밀번호 조건에 부합합니까?
          조건1_비밀번호는 8글자 이상 30글자 미만의 길이어야 합니다.
          조건2_영문, 숫자, 특수문자가 모두 포함되어야 합니다.
      `);
    }
  }
  /** Step_2. 비밀번호 변경 서버요청 Mutation */
  const { mutate: updateMutation } = useMutation({ mutationFn: fetchUpdate });
  /** Step_3. goModify 관련 함수 */
  function fetchUpdate(val) {
    try {
      const data = fetchNonPageServer(val, `post`, `auth/mypage/password`);
      return data;
    } catch (error) {
      throw new error; 
    }
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
            <i className="fas fa-times"></i>
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
                  value={inputForModify.now_password || ''}
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
                  value={inputForModify.re_password || ''}
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
                  value={inputForModify.confirm_re_password || ''}
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
              onClick={() => goModify()}>
              비밀번호<br />
              변경하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}