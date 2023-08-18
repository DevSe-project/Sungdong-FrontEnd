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

// 아이디찾기 모달창
function Find_IdModal() {
    // 인증할 API를 선택할 State (처음 화면은 pass를 통한 아이디찾기가 보이도록 초기값을 pass로 지정)
    const [api, setApi] = useState('pass');

    const PassApi = () => {
        return (
            <div className={styles.findButton}>
                본인명의 휴대폰으로 찾기
            </div>
        )
    }

    const SmsApi = () => {
        return (
            <div className={styles.sms_layout}>
                <div className={styles.sms_left}>
                    <table className={styles.smsInput_table}>
                        <tr>
                            <td className={styles.sms_label_td}>이름</td>
                            <td className={styles.sms_input_td}><input type='text' placeholder='가입자 성함' className={styles.sms_input} /></td>
                        </tr>
                        <tr>
                            <td className={styles.sms_label_td}>전화번호</td>
                            <td className={styles.sms_input_td}>
                                <input type='text' placeholder='전화번호' className={styles.sms_input} />
                            </td>
                        </tr>
                    </table>
                </div>
                <div className={styles.sms_right}>
                    인증번호<br />
                    요청
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.select_api}>
                    {/* 2번이상 클릭하면 체크박스 작동 안 하는 에러발생상태 */}
                    <div>
                        <input
                            type='radio'
                            value='pass'
                            name='Certified'
                            id='PASS_api'
                            checked={api === 'pass'}
                            onChange={() => {
                                if (api !== 'pass') {
                                    setApi('pass');
                                }
                            }} />
                        <label for="PASS_api">PASS인증 통해 찾기</label>
                    </div>
                    <div>
                        <input
                            type='radio'
                            value='sms'
                            name='Certified'
                            id='SMS_api'
                            checked={api === 'sms'}
                            onChange={() => {
                                if (api !== 'sms') {
                                    setApi('sms');
                                }
                            }} />
                        <label for="SMS_api">전화번호(SMS)로 찾기</label>
                    </div>
                </div>
                {/* 선택된 인증방법에 따른 인증화면 */}
                <div>
                    {api === 'pass' ?
                        // passAPI로 이동하는 링크버튼
                        <PassApi />
                        :
                        // smsAPI를 이름과 전화번호를 입력받고 인증번호 받기 버튼을 누르는 화면s
                        <SmsApi />
                    }
                </div>
            </div>
        </div>
    )
}

// 비밀번호찾기 모달창
function Find_PasswordModal() {

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.sms_layout}>
                    <div className={styles.sms_left}>
                        <table className={styles.smsInput_table}>
                            <tr>
                                <td className={styles.sms_label_td}>아이디</td>
                                <td className={styles.sms_input_td}><input type='text' placeholder='가입 아이디' className={styles.sms_input} /></td>
                            </tr>
                            <tr>
                                <td className={styles.sms_label_td}>전화번호</td>
                                <td className={styles.sms_input_td}>
                                    <input type='text' placeholder='전화번호' className={styles.sms_input} />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={styles.sms_right}>
                        비밀번호 <br />
                        재설정하기
                    </div>
                </div>
            </div>
        </div>
    )
}