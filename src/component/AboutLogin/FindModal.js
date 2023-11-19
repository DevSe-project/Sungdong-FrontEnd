import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useDataActions, useModal, useUserData } from '../../Store/DataStore';
import FindId from './FindId';
import FindPw from './FindPw';

export default function FindModal(props) {
    const { modalName, isModal, selectedModalOpen, selectedModalClose, setModalName } = useModal();
    const userData = useUserData();
    const { setUserData } = useDataActions();
    // Input State
    const [inputForFind, setInputForFind] = useState({
        id: '',
        ceoName: '',
        biz_num: '',
    })

    // 아이디 찾기 Input정보(대표명, 사업자등록번호) 일치 확인
    function checking_FindId() {
        // 일치하는 값 추출
        const confirmIdFind = userData.find(userData => userData.corporationData.ceoName === inputForFind.ceoName && userData.corporationData.businessNum === inputForFind.biz_num);
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
        const confirmPwFind = userData.find(userData => userData.id === inputForFind.id && userData.corporationData.businessNum === inputForFind.biz_num);
        // 값이 있다면 조건문 실행
        if (confirmPwFind && confirmPwFind.id === inputForFind.id && confirmPwFind.corporationData.businessNum === inputForFind.biz_num) {
            alert(`일치한 정보입니다. 비밀번호는 ${confirmPwFind.password}입니다.`);
        } else {
            alert("입력하신 정보가 일치하지 않습니다.");
        }
    }

    // enter키를 누르면 'ID찾기'
    function handleEnter_idFind(event) {
        if (event.key === 'Enter') {
            checking_FindId();
        }
    }
    // enter키를 누르면 'PW찾기'
    function handleEnter_pwFind(event) {
        if (event.key === 'Enter') {
            checking_FindPw();
        }
    }


    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                selectedModalClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
                setInputForFind({ // initialized
                    id: '',
                    ceoName: '',
                    biz_num: '',
                });
            }
        };

        window.addEventListener('keydown', exit_esc);

        return () => {
            window.removeEventListener('keydown', exit_esc);
        };
    }, [selectedModalClose, setInputForFind]);


    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.exitButton}>
                    <span onClick={() => { selectedModalClose() }}>
                        <i class="fas fa-times"></i>
                    </span>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.titleBox}>
                        <div
                            className={`${styles.title} ${modalName == 'find_id' ? styles.selected_title : ``}`}
                            onClick={() => { isModal && setModalName('find_id') }}>
                            아이디 찾기
                        </div>
                        <div
                            className={`${styles.title} ${modalName == 'find_pw' ? styles.selected_title : ``}`}
                            onClick={() => { isModal && setModalName('find_pw') }}>
                            비밀번호 찾기
                        </div>
                    </div>

                    {/* 아이디 비번 선택란 */}
                    {isModal && modalName === 'find_id' ? (
                        <FindId
                            inputForFind={inputForFind}
                            setInputForFind={setInputForFind}
                            checking_FindId={checking_FindId}
                            checking_FindPw={checking_FindPw}
                            handleEnter_idFind={handleEnter_idFind}
                        />
                    ) : isModal && modalName === 'find_pw' ? (
                        <FindPw
                            inputForFind={inputForFind}
                            setInputForFind={setInputForFind}
                            checking_FindId={checking_FindId}
                            checking_FindPw={checking_FindPw}
                            handleEnter_pwFind={handleEnter_pwFind}
                        />
                    ) :
                        alert("올바르지 않은 선택입니다.")
                    }
                </div>
            </div>
        </div>
    );
}