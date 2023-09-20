import { React, useEffect, useState } from 'react';
import styles from './ModyfyPW.module.css';

export default function ModifyPW(props) {

    // 현재비번, 재설정비번, 재설정비번확인 Input
    const [inputForModify, setInputForModify] = useState({
        now_password: 'bigdev2023!',
        re_password: '',
        confirm_re_password: ''
    })

    // 재설정 비번 일치확인
    const equal_re_password = inputForModify.re_password === inputForModify.confirm_re_password;

    // 비밀번호 수정 함수. 
    //Input정보 일치 확인 -> userData 최신화 
    function goModify() {
        const confirmPwFind = props.userData.find(userData => userData.password === inputForModify.now_password);

        if (confirmPwFind && confirmPwFind.password === inputForModify.now_password) {
            if (equal_re_password && inputForModify.re_password.length >= 8) {
                alert("두 비밀번호가 같고, 8글자 이상 입력하셨습니다.");
                const newPassword = {
                    ...props.userData,
                    password: inputForModify.re_password // 새로운 비밀번호로 변경
                }
                props.setUserData(newPassword);
                alert("비밀번호가 변경되었습니다.");
            } else {
                alert("두 비밀번호가 일치하지 않습니다.");
            }
        } else {
            alert("입력하신 정보가 일치하지 않습니다.");
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
                        userData={props.userData}
                        setUserData={props.setUserData}
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
