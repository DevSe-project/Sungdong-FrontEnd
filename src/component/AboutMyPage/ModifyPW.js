import { React, useEffect, useState } from 'react';
import styles from './ModifyPW.module.css';
import { useUserData } from '../../Store/DataStore';

export default function ModifyPW(props) {
    const userData = useUserData();
    const {setUserData} = useUserData();
    // 현재비번, 재설정비번, 재설정비번확인 Input
    const [inputForModify, setInputForModify] = useState({
        now_password: null,
        re_password: null,
        confirm_re_password: null
    })

    // 재설정 비번 일치확인
    const isPwEqual = inputForModify.re_password === inputForModify.confirm_re_password;
    // 입력유무 확인
    const isInputNull = inputForModify.re_password !== null && inputForModify.confirm_re_password != null;

    // 비밀번호 수정 함수. 
    function goModify() {
        const confirmPwFind = userData.find(userData => userData.password === inputForModify.now_password);

        if (confirmPwFind && confirmPwFind.password === inputForModify.now_password) {
            if (isInputNull) { // 입력유무 감지
                if (isPwEqual) { // 비밀번호 일치 확인
                    if (inputForModify.re_password.length >= 8 && inputForModify.confirm_re_password.length >= 8) {// 입력 값 8글자 이상

                        // 비밀번호 변경 로직 추가
                        const updatedUserData = userData.map(userData => {
                            if (userData.password === inputForModify.now_password) {
                                return { ...userData, password: inputForModify.re_password };
                            }
                            return userData;
                        });
                        setUserData(updatedUserData); // 사용자 데이터 업데이트

                        alert("변경 완료");
                    } else {
                        alert("비밀번호 8글자 이상 입력하십시오.");
                    }
                } else {
                    alert("※비밀번호 불일치※")
                }
            } else {
                alert("입력하지 않은 란 존재");
            }
        } else {
            alert("정확하지 않은 비밀번호");
        }
    }




    // enter키를 누르면 'PW찾기'
    function handleEnter_pwFind(event) {
        if (event.key === 'Enter') {
            goModify();
        }
    }

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                props.setModifyModal(false); // "Esc" 키 누를 때 모달 닫기 함수 호출
            }
        };

        window.addEventListener('keydown', exit_esc);

        return () => {
            window.removeEventListener('keydown', exit_esc);
        };
    }, [props.closeModal]);


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.exitButton}>
                    <span onClick={() => {
                        props.setModifyModal(false);
                    }}>
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.titleBox}>
                        <div className={`${styles.title}`}>
                            비밀번호 수정
                        </div>
                    </div>
                    {/* 비밀번호 수정 모달 내부 컴포넌트 */}
                    <ModifyInput
                        inputForModify={inputForModify}
                        setInputForModify={setInputForModify}
                        goModify={goModify}
                        handleEnter_pwFind={handleEnter_pwFind}
                    />
                </div>
            </div>
        </div>
    );
}

// ProveUser 모달 컴포넌트
function ModifyInput(props) {

    return (
        <div className={styles.contents_container}>
            <div className={styles.pw_layout}>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>현재 <br />비밀번호</div>
                    <div className={styles.input}>
                        <input
                            className={styles.input}
                            type='password'
                            placeholder='현재 비밀번호를 입력'
                            value={props.inputForModify.now_password}
                            onChange={(e) => {
                                const inputPassword = {
                                    ...props.inputForModify,
                                    now_password: e.target.value
                                }
                                props.setInputForModify(inputPassword);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>재설정 <br />비밀번호</div>
                    <div className={styles.input}>
                        <input
                            className={styles.input}
                            type='password'
                            placeholder='재설정할 비밀번호 입력'
                            value={props.inputForModify.re_password}
                            onChange={(e) => {
                                const inputCeoName = {
                                    ...props.inputForModify,
                                    re_password: e.target.value
                                };
                                props.setInputForModify(inputCeoName);
                            }}
                            onKeyDown={props.handleEnter_idFind}
                        />
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.label}>재설정 <br />비밀번호 <br />확인</div>
                    <div className={styles.input}>
                        <input
                            className={styles.input}
                            type='password'
                            placeholder='재설정할 비밀번호 확인'
                            value={props.inputForModify.confirm_re_password}
                            onChange={(e) => {
                                const inputbiz_num = {
                                    ...props.inputForModify,
                                    confirm_re_password: e.target.value
                                };
                                props.setInputForModify(inputbiz_num);
                            }}
                            onKeyDown={props.handleEnter_pwFind}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles.goModify}
                onClick={props.goModify}>
                비밀번호<br />
                변경하기
            </div>
        </div>
    )
}
