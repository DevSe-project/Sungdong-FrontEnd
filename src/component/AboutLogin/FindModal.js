import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';

export default function FindModal(props) {

    // Input State
    const [inputForFind, setInputForFind] = useState({
        id: '',
        ceoName: '',
        biz_num: '',
    })

    // 아이디 찾기 Input정보(대표명, 사업자등록번호) 일치 확인
    function checking_FindId() {
        // 일치하는 값 추출
        const confirmIdFind = props.userData.find(userData => userData.corporationData.ceoName === inputForFind.ceoName && userData.corporationData.businessNum === inputForFind.biz_num);
        // 값이 있다면 조건문 실행
        if (confirmIdFind && confirmIdFind.corporationData.ceoName === inputForFind.ceoName && confirmIdFind.corporationData.businessNum === inputForFind.biz_num) {
            alert(`일치한 정보입니다. 아이디는 ${confirmIdFind.id}입니다.`);
        } else {
            alert("입력하신 정보가 일치하지 않습니다.");
        }
    }

    // 비밀번호 찾기 Input정보(아이디, 사업자등록번호) 일치 확인
    function checking_FindPw() {
        // 일치하는 값 추출
        const confirmPwFind = props.userData.find(userData => userData.id === inputForFind.id && userData.corporationData.businessNum === inputForFind.biz_num);
        // 값이 있다면 조건문 실행
        if (confirmPwFind && confirmPwFind.id === inputForFind.id && confirmPwFind.corporationData.businessNum === inputForFind.biz_num) {
            alert(`일치한 정보입니다. 비밀번호는 ${confirmPwFind.password}입니다.`);
        } else {
            alert("입력하신 정보가 일치하지 않습니다.");
        }
    }

    // enter키를 누르면 'ID찾기'
    function handleEnter_idFind(event) {
        if(event.key === 'Enter') {
            checking_FindId();
        }
    }
    // enter키를 누르면 'PW찾기'
    function handleEnter_pwFind(event) {
        if(event.key === 'Enter') {
            checking_FindPw();
        }
    }


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


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.exitButton}>
                    <span onClick={() => { props.closeModal() }}>
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.titleBox}>
                        <div className={`${styles.title} ${props.modalType == 'id' ? styles.selected_title : ``}`} onClick={() => { props.openModal('id') }}>
                            아이디 찾기
                        </div>
                        <div className={`${styles.title} ${props.modalType == 'pw' ? styles.selected_title : ``}`} onClick={() => { props.openModal('pw') }}>
                            비밀번호 찾기
                        </div>
                    </div>

                    {/* 아이디 비번 선택란 */}
                    {
                        props.modalType === 'id'
                            ?
                            <Find_IdModal inputForFind={inputForFind} setInputForFind={setInputForFind} checking_FindId={checking_FindId} checking_FindPw={checking_FindPw} handleEnter_idFind={handleEnter_idFind} />
                            :
                            <Find_PasswordModal inputForFind={inputForFind} setInputForFind={setInputForFind} checking_FindId={checking_FindId} checking_FindPw={checking_FindPw} handleEnter_pwFind={handleEnter_pwFind}/>
                    }
                </div>
            </div>
        </div>
    );
}

// 아이디찾기 모달창
function Find_IdModal(props) {

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.id_layout}>
                    <div className={styles.idContainer}>
                        <div className={styles.idInput_Container}>
                            <div className={styles.nameContainer}>
                                <div className={styles.label}>대표명</div>
                                <div className={styles.input}>
                                    <input
                                        type='text'
                                        placeholder='대표명'
                                        className={styles.input}
                                        value={props.inputForFind.ceoName}
                                        onChange={(e) => {
                                            const inputCeoName = {
                                                ...props.inputForFind,
                                                ceoName: e.target.value
                                            };
                                            props.setInputForFind(inputCeoName);
                                        }}
                                        onKeyDown={props.handleEnter_idFind}
                                    />
                                </div>
                            </div>
                            <div className={styles.phoneNumContainer}>
                                <div className={styles.label}>사업자<br />등록번호</div>
                                <div className={styles.input}>
                                    <input
                                        type='text'
                                        placeholder='예)000-00-00000'
                                        className={styles.input}
                                        value={props.inputForFind.biz_num}
                                        onChange={(e) => {
                                            const inputCeoName = {
                                                ...props.inputForFind,
                                                biz_num: e.target.value
                                            };
                                            props.setInputForFind(inputCeoName);
                                        }}
                                        onKeyDown={props.handleEnter_idFind}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.reqNum} onClick={props.checking_FindId}>
                        찾기
                    </div>
                </div>
            </div>
        </div>
    )
}

// 비밀번호찾기 모달창
function Find_PasswordModal(props) {

    return (
        <div className={styles.inputContainer}>
            <div className={styles.pw_layout}>
                <div className={styles.idContainer}>
                    <div className={styles.idInput_Container}>
                        <div className={styles.nameContainer}>
                            <div className={styles.label}>아이디</div>
                            <div className={styles.input}>
                                <input
                                    type='text'
                                    placeholder='아이디'
                                    className={styles.input}
                                    value={props.inputForFind.id}
                                    onChange={(e) => {
                                        const inputCeoName = {
                                            ...props.inputForFind,
                                            id: e.target.value
                                        };
                                        props.setInputForFind(inputCeoName);
                                    }}
                                    onKeyDown={props.handleEnter_pwFind}
                                />
                            </div>
                        </div>
                        <div className={styles.phoneNumContainer}>
                            <div className={styles.label}>사업자등록번호</div>
                            <div className={styles.input}>
                                <input
                                    type='text'
                                    placeholder='예)000-00-00000'
                                    className={styles.input}
                                    value={props.inputForFind.biz_num}
                                    onChange={(e) => {
                                        const inputCeoName = {
                                            ...props.inputForFind,
                                            biz_num: e.target.value
                                        };
                                        props.setInputForFind(inputCeoName);
                                    }}
                                    onKeyDown={props.handleEnter_pwFind}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.goResetPassword} onClick={props.checking_FindPw}>
                    비밀번호<br />
                    찾기
                </div>
            </div>
        </div>
    )
}