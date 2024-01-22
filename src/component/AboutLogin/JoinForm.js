import { useState } from "react";
import styles from './RelativeJoin.module.css';
import axios from 'axios';
import { QueryClient } from "@tanstack/react-query";

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

    const [inputBizNum, setInputBizNum] = useState('');
    const [apiResponse, setApiResponse] = useState({});// API 호출 결과를 저장할 상태 
    const API_KEY = process.env.REACT_APP_BIZNUM_API_KEY;
    const API_ENDPOINT = 'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=' + API_KEY;
    // 사업자등록번호 진위확인 API
    const callCheckBizNumApi = async (val) => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "b_no": [
                            val
                        ]
                    }
                ),
            });

            if (!response.ok) {
                // API 호출 실패 시 에러 처리
                const errorData = await response.json();
                console.error('API 호출 중 에러:', errorData);
                return;
            }

            // API 호출 성공 시 데이터를 상태 변수에 저장
            const responseData = await response.json();
            setApiResponse(responseData);
        } catch (error) {
            // 네트워크 등 예기치 않은 에러 처리
            console.error('API 호출 중 에러:', error);
        }
    };



    //비밀번호, 비빈번호 재입력 일치유무 체크
    let confirmPassword = props.inputData.userPassword == props.inputData.confirmPassword;

    // 기업 정보
    const CorData = () => {
        return (
            <>
            </>
        )
    }

    return (
        <div>
            {/* 회원정보를 입력해주세요! */}
            <strong className={styles.noti}>회원정보를 입력해주세요!</strong>

            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>
                <div className={styles.indivisualMembers}>기본정보</div>

                {/* 아이디 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>아이디</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'아이디'}
                            name="id"
                            value={props.inputData.userId}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, userId: e.target.value })
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
                            value={props.inputData.userPassword}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, userPassword: e.target.value })
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
                            type='email'
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
                                    value={1}
                                    checked={props.inputData.emailService === 1}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 1 })
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
                                    value={0}
                                    checked={props.inputData.emailService === 0}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, emailService: 0 })
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
                                    (prevData) => ({ ...prevData, num3: e.target.value })
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
                                    value={1}
                                    checked={props.inputData.smsService === 1}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 1 })
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
                                    value={0}
                                    checked={props.inputData.smsService === 0}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 0 })
                                        )
                                    }}
                                />
                                <label htmlFor="SMS_N">아니오</label>
                            </div>
                        </div>
                    </div>
                </li>
                {/* 우편번호 찾기 */}
                <li>
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
                                                (prevData) => ({ ...prevData, zonecode: e.target.value })
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
                                        value={props.inputData.addressDetail}
                                        onChange={(e) => {
                                            props.setInputData(
                                                (prevData) => ({ ...prevData, addressDetail: e.target.value })
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                {/* ----------기업 정보---------- */}

                {/* 기업명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>기업명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'ex) OO전자'}
                            value={props.inputData.corporationData.cor_corName}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({
                                        ...prevData,
                                        corporationData: {
                                            ...prevData.corporationData,
                                            cor_corName: e.target.value
                                        }
                                    })
                                )
                            }}
                        />
                        <button onClick={() => { }}>기업명 호출(미완성)</button>
                        {/* 해당 기업명을 호출 */}
                        {apiResponse && apiResponse.businesses && apiResponse.businesses[0] && (
                            // 기업명 출력
                            <div>
                                <h2>b_nm 값:</h2>
                                <p>{apiResponse.businesses[0].b_nm}</p>
                            </div>
                        )}
                    </div>
                </li>

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
                                    checked={props.inputData.userType_id === 1}
                                    onChange={() => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType_id: 1 })
                                        )
                                    }}
                                />
                                <label htmlFor="endUser">실사용자</label>
                            </div>
                            <div className={styles.typeMember}>
                                <input
                                    type="radio"
                                    id="corporateMember"
                                    name="userType"
                                    value={props.inputData.userType}
                                    checked={props.inputData.userType_id === 2}
                                    onChange={() => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, userType_id: 2 })
                                        )
                                    }}
                                />
                                <label htmlFor="corporateMember">납품</label>
                            </div>
                        </div>
                    </div>
                </li>


                {/* 사업자등록번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>사업자등록번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder='-을 제외하고 입력하시오'
                            value={inputBizNum}
                            onChange={(e) => setInputBizNum(e.target.value)}
                        />
                        <button onClick={() => {
                            callCheckBizNumApi(inputBizNum)
                            console.log(process.env.REACT_APP_BIZNUM_API_KEY);
                        }
                        }>사업자등록번호 인증</button>
                    </div>
                    {apiResponse.data ? <strong>{apiResponse.data.b_stt}</strong> : <strong>해당 번호로 인증할 수 없습니다.</strong>}
                </li>

                {/* 대표자명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표자명</div>
                    <div className={styles.right}>
                        <input
                            className={styles.isInput}
                            type='text'
                            placeholder={'홍길동'}
                            value={props.inputData.corporationData.cor_ceoName}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_ceoName: e.target.value
                                    }
                                }))
                            }}
                        />
                    </div>
                </li>

                {/* 대표번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표번호</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type="text"
                            placeholder={'ex) 010'}
                            maxLength="3"
                            size="6"
                            value={props.inputData.corporationData.cor_tel.num1}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_tel: {
                                            ...prevData.corporationData.cor_tel,
                                            num1: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 1234'}
                            maxLength="4"
                            size="8"
                            value={props.inputData.corporationData.cor_tel.num2}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_tel: {
                                            ...prevData.corporationData.cor_tel,
                                            num2: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'ex) 5678'}
                            maxLength="4"
                            size="8"
                            value={props.inputData.corporationData.cor_tel.num3}
                            onChange={(e) => {
                                props.setInputData(prevData => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_tel: {
                                            ...prevData.corporationData.cor_tel,
                                            num3: e.target.value
                                        }
                                    }
                                }))
                            }}
                        />
                        {/* <div className={styles.notification}>
                            <strong>문자(SMS) 서비스를 받으시겠습니까?</strong>
                            <div className={styles.YesNo}>
                            <label for="CEO_SMS_Y">
                                <input
                                    type="radio"
                                    name="CEO_SMS"
                                    id="CEO_SMS_Y"
                                    value={1}
                                    checked={props.inputData.smsService === 1}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 1 })
                                        )
                                    }}
                                />
                                예</label>
                            </div>
                            <div className={styles.YesNo}>
                                <input
                                    type="radio"
                                    name="CEO_SMS"
                                    id="CEO_SMS_N"
                                    value={0}
                                    checked={props.inputData.smsService === 0}
                                    onChange={(e) => {
                                        props.setInputData(
                                            (prevData) => ({ ...prevData, smsService: 0 })
                                        )
                                    }}
                                />
                                <label for="CEO_SMS_N">아니오</label>
                            </div>
                        </div> */}
                    </div>
                </li>

                <li className={styles.inputContainer}>
                    {/* API 호출 결과 표시 */}
                    {apiResponse && (
                        <div>
                            <h2>인증 결과:</h2>
                            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    )
}