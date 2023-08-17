import { React, useEffect, useState } from 'react';
import styles from './FindModal.module.css';

export default function FindModal({ type, onClose, openModal }) {



    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                onClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
            }
        };

        window.addEventListener('keydown', exit_esc);

        return () => {
            window.removeEventListener('keydown', exit_esc);
        };
    }, []);
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.exitButton}>
                    <span onClick={() => { onClose() }}>
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.titleBox}>
                        <div className={styles.title} onClick={() => { openModal('id') }}>
                            아이디 찾기
                        </div>
                        <div className={styles.title} onClick={() => { openModal('pw') }}>
                            비밀번호 찾기
                        </div>
                    </div>

                    {/* 아이디 비번 선택란 */}
                    {type === 'id' ? <Find_IdModal /> : <Find_PasswordModal />}
                </div>
            </div>
        </div>
    );
}

function Find_IdModal() {
    // 인증할 API를 선택할 State
    const [api, setApi] = useState('pass')

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.select_api}>
                    <div>
                        <input
                            type='radio'
                            name='Certified'
                            id='PASS_api'
                            checked={api === 'pass'}
                            onChange={() => {
                                setApi('pass')
                            }} />
                        <label for="PASS_api">PASS인증 통해 찾기</label>
                    </div>
                    <div>
                        <input
                            type='radio'
                            name='Certified'
                            id='SMS_api'
                            checked={api === 'sms'}
                            onChange={() => {
                                setApi('sms')
                            }} />
                        <label for="SMS_api">전화번호(SMS)로 찾기</label>
                    </div>
                </div>
                <div className={styles.show_selectedApiButton}>
                    {api === 'pass' ?
                        // passAPI로 이동하는 링크버튼
                        <div className={styles.findButton}>
                            본인명의 휴대폰으로 찾기
                        </div> : "sms"}
                </div>
            </div>
        </div>
    )
}

function Find_PasswordModal() {

    return (
        <div>
            <table className={styles.inputContainer}>
                <tr>
                    <td className={styles.label}>이름</td>
                    <td><input type='text' name="join_name" placeholder='가입자 성함' className={styles.input} /></td>
                </tr>
                <tr>
                    <td className={styles.label}>아이디</td>
                    <td>
                        <input type='text' name="join_email" placeholder='아이디' className={styles.input} />
                    </td>
                </tr>
            </table>
        </div>
    )
}