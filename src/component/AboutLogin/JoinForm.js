import { useState } from "react";
import styles from './RelativeJoin.module.css';
import CorporateMember from "./CorporateMembers";


export default function JoinForm(props) {

    // 주소입력 API
    const [address, setAddress] = useState("");
    const openPopup = (setAddress) => {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    setAddress(data); //표시용
                    props.setInputData((prevData) => ({
                        ...prevData,
                        address: data
                    }))
                }
            }).open();
        }
        document.body.appendChild(script);
    }

    //data 일치유무 체크
    let confirmPassword = props.inputData.password === props.inputData.confirmPassword;

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
                                <input
                                    type="radio"
                                    id="indivisualMember"
                                    name="userType"
                                    value={props.inputData.userType}
                                    checked={props.inputData.userType === "indivisual"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType: 'indivisual' })
                                        )
                                    }}
                                />
                                <label htmlFor="indivisualMember">개인회원</label>
                            </div>
                            <div className={styles.typeMember}>
                                <input
                                    type="radio"
                                    id="corporateMember"
                                    name="userType"
                                    value={props.inputData.userType}
                                    checked={props.inputData.userType === "corporation"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType: 'corporation' })
                                        )
                                    }}
                                />
                                <label htmlFor="corporateMember">기업회원</label>
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
                            name="id"
                            value={props.inputData.id}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, id: e.target.value })
                                )
                            }}
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
                            name="password"
                            value={props.inputData.password}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, password: e.target.value })
                                )
                            }}
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
                            name="confirmPassword"
                            value={props.inputData.confirmPassword}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, confirmPassword: e.target.value })
                                )
                            }}
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
                            placeholder={'이메일'}
                            name="email"
                            value={props.inputData.email}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, email: e.target.value })
                                )
                            }}
                        />
                        <div className={styles.notification}>
                            <strong>이메일 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    id="email_Y"
                                    name="emailService"
                                    value="yes"
                                    checked={props.inputData.emailService === "yes"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 'yes' })
                                        )
                                    }}
                                />
                                <label htmlFor="email_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    id="email_N"
                                    name="emailService"
                                    value="no"
                                    checked={props.inputData.emailService === "no"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 'no' })
                                        )
                                    }}
                                />
                                <label htmlFor="email_N">아니오</label>
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
                            placeholder={'이름'}
                            name="name"
                            value={props.inputData.name}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, name: e.target.value })
                                )
                            }}
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
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                            name="num1"
                            value={props.inputData.num1}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, num1: e.target.value })
                                )
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 0101'}
                            maxLength="4"
                            size="8"
                            name="num2"
                            value={props.inputData.num2}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, num2: e.target.value })
                                )
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1010'}
                            maxLength="4"
                            size="8"
                            name="num3"
                            value={props.inputData.num3}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, smsService: 'yes' })
                                )
                            }}
                        />
                        <div className={styles.notification}>
                            {/* 추후  */}
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="smsService"
                                    id="SMS_Y"
                                    value="yes"
                                    checked={props.inputData.smsService === "yes"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 'yes' })
                                        )
                                    }}
                                />
                                <label htmlFor="SMS_Y">예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="smsService"
                                    id="SMS_N"
                                    value="no"
                                    checked={props.inputData.smsService === "no"}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 'no' })
                                        )
                                    }}
                                />
                                <label htmlFor="SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 우편번호 찾기 - 개인회원일 때만 보이도록 */}
                {props.inputData.userType === 'corporation' ? null :
                    <li> {/* 개인회원일 떄 보이는 우편번호찾기API */}
                        <div className={styles.inputContainer}>
                            <div className={styles.left}>배송주소</div>
                            <div className={styles.right}>
                                <div className={styles.rightInnerContainer}>
                                    <div className={styles.searchAddress}>
                                        <input
                                            className={styles.isInput}
                                            type="text"
                                            placeholder="우편번호"
                                            readOnly
                                            name="address"
                                            value={address && address.zonecode}
                                            onChange={(e) => {
                                                props.setInputData(
                                                    (prevData) => ({ ...prevData, address: e.target.value })
                                                )
                                            }}
                                        />
                                        <input
                                            className={styles.searchButton}
                                            type="button"
                                            onClick={() => {
                                                openPopup(setAddress);
                                            }}
                                            value="우편번호 찾기"
                                        />
                                    </div>
                                    <div className={styles.inputAddress}>
                                        <input
                                            className={styles.loadname}
                                            type="text"
                                            value={address && address.roadAddress}
                                            placeholder="도로명 주소"
                                            readOnly
                                        />
                                        <input
                                            className={styles.buildingname}
                                            type="text"
                                            value={
                                                address && address.buildingName
                                                    ?
                                                    `(${address.bname}, ${address.buildingName})`
                                                    :
                                                    address && `(${address.bname}, ${address.jibunAddress})`
                                            }
                                            placeholder="건물 이름 또는 지번 주소"
                                            readOnly
                                        />
                                        <input
                                            className={styles.detailAddress}
                                            type="text"
                                            placeholder="상세주소를 입력해주세요."
                                            name="detailAddress"
                                            value={props.inputData.detailAddress}
                                            onChange={(e) => {
                                                props.setInputData(
                                                    (prevData) => ({ ...prevData, detailAddress: e.target.value })
                                                )
                                            }}
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
            {props.inputData.userType === "corporation" ? <CorporateMember inputData={props.inputData} setInputData={props.setInputData} address={address} setAddress={setAddress} openPopup={openPopup} /> : null}
        </div>
    )
}