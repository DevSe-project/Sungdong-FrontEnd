import { useInsertionEffect, useState } from "react";
import styles from './RelativeJoin.module.css';
import CorporateMember from "./CorporateMembers";


export default function JoinForm(inputData, setInputData) {

    // 개인&기업 회원 체크box
    let [memberType, setMemberType] = useState(false); //false면 개인, true면 기업

    // 입력된 정보 삽입
    let handleId = (e) => { //아이디
        const newId = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            id: newId
        }));
    };
    let handlePassword = (e) => { //비밀번호
        const newPassword = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            password: newPassword
        }));
    };
    let handleConfirmPassword = (e) => { //비밀번호 재확인
        const newConfirmPassword = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            confirmPassword: newConfirmPassword
        }));
    };
    let handleEmail = (e) => { //이메일
        const newEmail = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            email: newEmail
        }));
    };
    let handleName = (e) => { //이름
        const newName = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            name: newName
        }));
    };
    let handlePhoneNumber1 = (e) => { //전화번호
        const newPhoneNumber = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            num1: newPhoneNumber
        }));
    };
    let handlePhoneNumber2 = (e) => { //전화번호
        const newPhoneNumber = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            num2: newPhoneNumber
        }));
    };
    let handlePhoneNumber3 = (e) => { //전화번호
        const newPhoneNumber = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            num3: newPhoneNumber
        }));
    };

    // 주소입력 API
    const [address1, setAddress1] = useState("");
    const openPopup = (setAddress) => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    setAddress(data);
                }
            }).open();
        }
        document.body.appendChild(script);
    }

    //data 일치유무 체크
    let confirmPassword = inputData.password === inputData.confirmPassword;

    return (
        <div>
            {/* 회원정보를 입력해주세요! */}
            <strong className={styles.noti}>회원정보를 입력해주세요!</strong>

            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>
                <div className={styles.indivisualMembers}>기본정보</div>

                {/* 개인 OR 기업 체크박스 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>회원구분</div>
                    <div className={styles.right}>
                        <div className={styles.isInput}>
                            <div className={styles.typeMember}>
                                <input type="radio" name="memberType" id="indivisualMember" onChange={() => setMemberType(false)} /><label htmlfor="indivisualMember">개인회원</label>
                            </div>
                            <div className={styles.typeMember}>
                                <input type="radio" name="memberType" id="corporateMember" onChange={() => setMemberType(true)} /><label htmlfor="corporateMember">기업회원</label>
                            </div>
                        </div>
                        <div className={styles.notification}>기업회원은 아래에 추가 정보입력 란이 있습니다.</div>
                    </div>
                </li>

                {/* 아이디 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>아이디</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'아이디'}
                            value={inputData.id}
                            onChange={handleId}
                        />
                        <div className={styles.notification}> ?~??자리의 영문,숫자를 입력해주십시오.</div>
                    </div>
                </li>
                <div className={styles.warnningMessage}>
                </div>

                {/* 비밀번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='password'
                            placeholder={'비밀번호'}
                            value={inputData.password}
                            onChange={handlePassword}
                        />
                        <div className={styles.notification}>영문 및 특수문자, 숫자 조합의 8자리 이상 입력해주시기 바랍니다.</div>
                    </div>
                </li>

                {/* 비밀번호 확인 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호 확인</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='password'
                            placeholder={'비밀번호 재입력(일치 확인)'}
                            value={inputData.confirmPassword}
                            onChange={handleConfirmPassword}
                        />
                        <div className={styles.notification}>비밀번호 확인을 위해 다시 한 번 입력해주십시오.</div>
                    </div>
                </li>
                {confirmPassword ? null : <div className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다!
                </div>}

                {/* 이메일 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>이메일</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            value={inputData.email}
                            placeholder={'이메일'}
                            onChange={handleEmail}
                        />
                        <div className={styles.notification}>
                            <strong>이메일 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input type="radio" name="email" id="email_Y" /><label htmlFor="email_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input type="radio" name="email" id="email_N" /><label htmlFor="email_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>

                {/* 이름 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>이름</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            value={inputData.name}
                            placeholder={'이름'}
                            onChange={handleName}
                        />
                        <div className={styles.notification}>실명을 입력해주세요</div>
                    </div>
                </li>

                {/* 휴대폰 번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>휴대폰 번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type='text'
                            value={inputData.num1}
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                            onChange={handlePhoneNumber1}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            value={inputData.num2}
                            placeholder={'ex) 0101'}
                            maxLength="4"
                            size="8"
                            onChange={handlePhoneNumber2}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            value={inputData.num3}
                            placeholder={'ex) 1010'}
                            maxLength="4"
                            size="8"
                            onChange={handlePhoneNumber3}
                        />
                        <div className={styles.notification}>
                            {/* 추후  */}
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input type="radio" name="SMS" id="SMS_Y" /><label htmlFor="SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input type="radio" name="SMS" id="SMS_N" /><label htmlFor="SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 우편번호 찾기 - 개인회원일 때만 보이도록 */}
                {memberType ? null :
                    <li> {/* 개인회원일 떄 보이는 우편번호찾기API */}
                        <div className={styles.inputContainer}>
                            <div className={styles.left}>주소</div>
                            <div className={styles.right}>
                                <div className={styles.rightInnerContainer}>
                                    <div className={styles.searchAddress}>
                                        <input
                                            className={styles.isInput}
                                            type="text" value={address1 && address1.zonecode}
                                            placeholder="우편번호"
                                            readOnly
                                        />
                                        <input
                                            className={styles.searchButton}
                                            type="button"
                                            onClick={() => {
                                                openPopup(setAddress1);
                                            }}
                                            value="우편번호 찾기"
                                        />
                                    </div>
                                    <div className={styles.inputAddress}>
                                        <input
                                            className={styles.loadname}
                                            type="text"
                                            value={address1 && address1.roadAddress}
                                            placeholder="도로명 주소"
                                            readOnly
                                        />
                                        <input
                                            className={styles.buildingname}
                                            type="text"
                                            value={address1 && address1.buildingName ? `(${address1.bname}, ${address1.buildingName})` : address1 && `(${address1.bname}, ${address1.jibunAddress})`} placeholder="건물 이름 또는 지번 주소"
                                            readOnly
                                        />
                                        <input
                                            className={styles.detailAddress}
                                            type="text"
                                            placeholder="상세주소를 입력해주세요."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                }
            </ul>
            <br /> <br />
            {/* 회원구분 체크에 따라 기업회원 가입정보창을 보여줄지 말지 */}
            {memberType ? <CorporateMember inputData={inputData} setInputData={setInputData} address1={address1} setAddress1={setAddress1} openPopup={openPopup} /> : null}
        </div>
    )
}