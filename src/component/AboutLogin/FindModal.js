import { React, useEffect, useState } from 'react';
import styles from './Modal.module.css';
import { useDataActions, useModalActions, useModalState, useUserData } from '../../store/DataStore';
import FindId from './FindId';
import FindPw from './FindPw';
import axios from '../../axios';
import { useMutation } from '@tanstack/react-query';

export default function FindModal(props) {
    const { modalName, isModal } = useModalState();
    const { selectedModalOpen, selectedModalClose, setModalName } = useModalActions();
    const userData = useUserData();
    const { setUserData } = useDataActions();
    // Input State
    const [inputForFind, setInputForFind] = useState({
        userId: '',
        cor_ceoName: '',
        cor_num: '',
    })

    // 로그인 처리 로직
    const findIdRequest = async (loginData) => {
        try {
            const response = await axios.post("/auth/findId",
                JSON.stringify({
                    cor_ceoName: loginData.cor_ceoName,
                    cor_num: loginData.cor_num
                }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            // 성공 시 추가된 상품 정보를 반환합니다.
            return response.data;
        } catch (error) {
            // 실패 시 예외를 throw합니다.
            throw new Error('아이디를 찾는 중 오류가 발생했습니다.');
        }
    }
    const findPwRequest = async (loginData) => {
        try {
            const response = await axios.post("/auth/findPw",
                JSON.stringify({
                    userId: loginData.userId,
                    cor_num: loginData.cor_num
                }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            // 성공 시 추가된 상품 정보를 반환합니다.
            return response.data;
        } catch (error) {
            // 실패 시 예외를 throw합니다.
            throw new Error('비밀번호를 찾는 중 오류가 발생했습니다.');
        }
    }
    const { mutate: findIdMutate } = useMutation({ mutationFn: findIdRequest })
    const { mutate: findPwMutate } = useMutation({ mutationFn: findPwRequest })


    // 아이디 찾기 Input정보(대표명, 사업자등록번호) 일치 확인
    function checking_FindId() {
        findIdMutate(inputForFind, {
            onSuccess: (data) => {
                console.log('UserId Find successfully:', data);
                alert(`일치한 정보입니다. 아이디는 ${data.data.userId}입니다.`);
            },
            onError: (error) => {
                console.error('UserId Find Failed:', error);
                // 에러 처리 또는 메시지 표시
                alert("입력하신 정보가 일치하지 않습니다.");
            },
        });
    }

    // 비밀번호 찾기 Input정보(아이디, 사업자등록번호) 일치 확인
    function checking_FindPw() {
        // // 일치하는 값 추출
        // const confirmPwFind = userData.find(userData => userData.id === inputForFind.id && userData.corporationData.businessNum === inputForFind.biz_num);
        // // 값이 있다면 조건문 실행
        // if (confirmPwFind && confirmPwFind.id === inputForFind.id && confirmPwFind.corporationData.businessNum === inputForFind.biz_num) {
        //     alert(`일치한 정보입니다. 비밀번호는 ${confirmPwFind.password}입니다.`);
        // } else {
        //     alert("입력하신 정보가 일치하지 않습니다.");
        // }
        findPwMutate(inputForFind, {
            onSuccess: (data) => {
                console.log('UserPw Find successfully:', data);
                alert(`일치한 정보입니다. \n${inputForFind.userId}의 비밀번호는 ${data.data.userPassword}입니다.`);
            },
            onError: (error) => {
                console.error('UserPw Find Failed:', error);
                // 에러 처리 또는 메시지 표시
                alert("입력하신 정보가 일치하지 않습니다.");
            },
        });
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
                    userId: '',
                    cor_ceoName: '',
                    cor_num: '',
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
                        <i className="fas fa-times"></i>
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