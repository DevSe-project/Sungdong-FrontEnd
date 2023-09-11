import { React, useEffect } from 'react';
import styles from './Modal.module.css';

export default function FindModal(props) {
    
    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                props.CloseModal(); // "Esc" 키 누를 때 모달 닫기 함수 호출
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
                    {props.modalType === 'id' ? <Find_IdModal /> : <Find_PasswordModal />}
                </div>
            </div>
        </div>
    );
}

// 아이디찾기 모달창
function Find_IdModal() {

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.id_layout}>
                    <div className={styles.idContainer}>
                        <div className={styles.idInput_Container}>
                            <div className={styles.nameContainer}>
                                <div className={styles.label}>대표명</div>
                                <div className={styles.input}>
                                    <input type='text' placeholder='대표명' className={styles.input} /></div>
                            </div>
                            <div className={styles.phoneNumContainer}>
                                <div className={styles.label}>사업자<br />등록번호</div>
                                <div className={styles.input}>
                                    <input type='text' placeholder='예)000-00-00000' className={styles.input} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.reqNum} onClick={() => { }}>
                        찾기
                    </div>
                </div>
            </div>
        </div>
    )
}

// 비밀번호찾기 모달창
function Find_PasswordModal() {

    return (
        <div className={styles.inputContainer}>
            <div className={styles.pw_layout}>
                <div className={styles.idContainer}>
                    <div className={styles.idInput_Container}>
                        <div className={styles.nameContainer}>
                            <div className={styles.label}>아이디</div>
                            <div className={styles.input}><input type='text' placeholder='아이디' className={styles.input} /></div>
                        </div>
                        <div className={styles.phoneNumContainer}>
                            <div className={styles.label}>사업자등록번호</div>
                            <div className={styles.input}>
                                <input type='text' placeholder='예)000-00-00000' className={styles.input} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.goResetPassword} onClick={() => { }}>
                    비밀번호<br />
                    찾기
                </div>
            </div>
        </div>
    )
}