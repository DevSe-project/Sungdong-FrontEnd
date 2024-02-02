import { useState } from "react";
import styles from './RelativeJoin.module.css';
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "../../axios";
import { useErrorHandling } from "../../customFn/ErrorHandling";

export default function JoinForm(props) {
    const { handleUnauthorizedError, handleOtherErrors } = useErrorHandling();

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

    const [isCallApi, setIsCallApi] = useState(false);
    const [apiResponse, setApiResponse] = useState({});// API 호출 결과를 저장할 상태 
    const API_KEY = process.env.REACT_APP_BIZNUM_API_KEY;
    const API_ENDPOINT = 'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=' + API_KEY;
    // 기업정보 진위확인 API
    const callCheckCorInfoApi = async (corNum, corStartDate, corCeoName) => {
        setIsCallApi(isCallApi + 1);
        console.log(isCallApi);
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "businesses": [
                            {
                                "b_no": corNum, // 사업자등록번호
                                "start_dt": corStartDate, // 개업일자
                                "p_nm": corCeoName, // 대표1
                            }
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

    //주문 데이터 fetch
    const fetchDuplicatedData = async (userID) => {
        try {
            const response = await axios.post("/auth/duplicate",
                JSON.stringify({ userId: userID }),
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )

            return response.data;
        } catch (error) {
            // 서버 응답이 실패인 경우
            if (error.response && error.response.status === 409) {
                // 서버가 401 UnAuthorazation를 반환한 경우
                handleUnauthorizedError(error.response.data.message);
                throw new Error(error.response.data.message);
            } else {
                handleOtherErrors('예기치 못한 오류가 발생했습니다.');
                throw new Error(error.response.data.message);
            }
        }
    };

    // 아이디 중복체크 API
    const { mutate: duplicateMutate } = useMutation({ mutationFn: fetchDuplicatedData })
    function handleIsDuplicateId(id) {
        if (isIdRegexValid) {
            duplicateMutate(id, {
                onSuccess: (success) => {
                    setIdDuplicateCheck(true);
                    console.log("중복체크 완료.", success);
                    alert(success.message);
                },
                onError: (error) => {
                    setIdDuplicateCheck(false);
                    console.error(error);
                    alert(error);
                },
            });
        } else {
            alert("조건에 부합하지 않는 아이디입니다.");
        }
    }

    // 입력이 시작됐는지 추적
    const [isRegexValid, setIsRegexValid] = useState(false);

    // 아이디 중복체크 및 정규 표현식에 부합하는지 확인
    const [idDuplicateCheck, setIdDuplicateCheck] = useState(false);
    const userIdRegex = /^.{8,19}$/; // 아이디가 8글자 이상 20글자 미만인지를 확인하는 정규 표현식
    const [isIdRegexValid, setIsIdRegexValid] = useState(true); // 초기값을 true로 설정(초기에는 경고문구가 안뜨도록)
    const [isIdChanged, setIsIdChanged] = useState(false); // 아이디가 변경되었는지 여부를 추적하는 상태


    //비밀번호, 비빈번호 재입력 일치유무 체크
    let isPwEqual = props.inputData.userPassword == props.inputData.confirmPassword;
    // 비밀번호 형식 검증을 위한 정규 표현식 (영문자, 특수문자 중 하나 포함하고 8글자~30글자 사이만 허용한다는 정규표현식 조건)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_`])[A-Za-z\d\W_`]{8,30}$/;
    // 비밀번호가 정규 표현식에 부합하는지 확인
    const isPasswordRegexValid = passwordRegex.test(props.inputData.userPassword);
    // 비밀번호 길이와 형식이 모두 조건에 부합하는지 확인
    const isPasswordValid = isPwEqual && isPasswordRegexValid;

    // 이메일 정규 표현식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 이름 정규표현식
    const nameRegex = /^[a-zA-Z가-힣]{2,30}$/;

    // 기타Input 정규표현식
    const customRegex = /^[a-zA-Z가-힣\s()]{1,50}$/;


    return (
        <div>
            {/* 회원정보를 입력해주세요! */}
            <strong style={{ fontSize: '20px', fontWeight: 'bold', color: '#CC0000' }}>환영합니다! 회원정보를 입력해주세요!</strong>

            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>
                <div className={styles.indivisualMembers}>기본정보</div>

                {/* 아이디 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>아이디</div>
                    <div style={{ gap: '0.5em' }} className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder={'아이디'}
                            name="id"
                            value={props.inputData.userId}
                            onChange={(e) => {
                                const newId = e.target.value;
                                // 아이디가 변경되었음을 표시
                                setIsIdChanged(true);
                                // 아이디 변경 시 중복 체크 상태 초기화
                                setIdDuplicateCheck(false);
                                // 아이디가 정규 표현식에 부합하는지 확인하여 상태 업데이트
                                setIsIdRegexValid(userIdRegex.test(newId));
                                // 아이디 상태 업데이트
                                props.setInputData(prevData => ({ ...prevData, userId: newId }));
                            }}
                            style={{ backgroundColor: isIdRegexValid && idDuplicateCheck ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {/* 중복 체크 */}
                            <button className='original_button' onClick={() => handleIsDuplicateId(props.inputData.userId)}>중복체크</button>
                            {/* 경고 문구 */}
                            {isIdChanged && !idDuplicateCheck && <span style={{ color: 'var(--main-red)', marginLeft: '10px' }}>중복 체크를 해야 합니다.</span>}
                            {!isIdRegexValid && <span style={{ color: 'var(--main-red)', marginLeft: '10px' }}>아이디는 8~20글자여야 합니다.</span>}
                        </div>
                    </div>
                </li>

                <div className={styles.warnningMessage}>
                </div>

                {/* 비밀번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='password'
                            placeholder={'비밀번호'}
                            name="password"
                            value={props.inputData.userPassword}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, userPassword: e.target.value })
                                )
                            }}
                            style={{ backgroundColor: isPasswordRegexValid ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {isPasswordRegexValid ? '' : <span className={styles.errorMessage}>영문 및 특수문자, 숫자 조합의 8자리 이상 입력해주시기 바랍니다.</span>}
                        </div>
                    </div>
                </li>

                {/* 비밀번호 확인 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>비밀번호 확인</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='password'
                            placeholder={'비밀번호 재입력(일치확인)'}
                            name="confirmPassword"
                            value={props.inputData.confirmPassword}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, confirmPassword: e.target.value })
                                )
                            }}
                            style={{ backgroundColor: isPasswordValid ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {isPasswordValid ? null : <span className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</span>}
                        </div>
                    </div>
                </li>


                {/* 이메일 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>이메일</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='email'
                            placeholder={'이메일'}
                            name="email"
                            value={props.inputData.email}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, email: e.target.value })
                                )
                            }}
                            style={{ backgroundColor: emailRegex.test(props.inputData.email) ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {emailRegex.test(props.inputData.email) ? null : (
                                <span className={styles.errorMessage}>올바른 이메일 형식이 아닙니다.</span>
                            )}
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
                    <div className={styles.left}>담당자명</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder={'이름'}
                            name="name"
                            value={props.inputData.name}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({ ...prevData, name: e.target.value })
                                )
                            }}
                            style={{ backgroundColor: nameRegex.test(props.inputData.name) ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {nameRegex.test(props.inputData.name) ? '' : <span className={styles.errorMessage}>올바르지 않은 이름입니다.</span>}
                        </div>
                    </div>
                </li>

                {/* 담당자 연락처 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>담당자 연락처</div>
                    <div className={styles.right}>
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder={'예) 010'}
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
                            placeholder={'예) 0101'}
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
                            placeholder={'예) 1010'}
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
                                        className='basic_input'
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
                                        className='original_button'
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
            </ul>
            <br />


            {/* -----------------------------기업 인증----------------------------- */}
            <div className={styles.indivisualMembers}>기업인증</div>

            {/* 목록 */}
            <ul className={styles.inputWrap}>
                {/* 사업자등록번호 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>사업자등록번호</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder='예)5898812345'
                            value={props.inputData.corporationData.cor_num}
                            onChange={(e) => {
                                props.setInputData(
                                    (prevData) => ({
                                        ...prevData,
                                        corporationData: {
                                            ...prevData.corporationData,
                                            cor_num: e.target.value
                                        }
                                    })
                                )
                            }}
                            disabled={apiResponse.valid_cnt}
                            style={{ backgroundColor: apiResponse.valid_cnt ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {/* 안내 문구 */}
                            {
                                apiResponse.valid_cnt
                                    ?
                                    <span style={{ color: 'green' }}>인증이 완료되었습니다. 더 이상 수정할 수 없습니다.</span>
                                    :
                                    <span className={styles.errorMessage}>기업인증 필수 항목: 하이픈('-')을 생략한 번호를 기입하십시오.</span>
                            }
                        </div>
                    </div>
                </li>

                {/* 개업연월일 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>개업연월일</div>
                    <div className={styles.right}>
                        <input
                            type="text"
                            placeholder="예)20201206"
                            className="basic_input"
                            value={props.cor_startDate}
                            onChange={(e) => {
                                props.setInputData((prevData) => ({
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_startDate: e.target.value
                                    }
                                }))
                            }}
                            disabled={apiResponse.valid_cnt}
                            style={{ backgroundColor: apiResponse.valid_cnt ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {/* 안내 문구 */}
                            {
                                apiResponse.valid_cnt
                                    ?
                                    <span style={{ color: 'green' }}>인증이 완료되었습니다. 더 이상 수정할 수 없습니다.</span>
                                    :
                                    <span className={styles.errorMessage}>기업인증 필수 항목: 하이픈('-')을 생략한 번호를 기입하십시오.</span>
                            }
                        </div>
                    </div>
                </li>

                {/* 대표명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>대표명</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder={'예)홍길동'}
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
                            disabled={apiResponse.valid_cnt}
                            style={{ backgroundColor: apiResponse.valid_cnt ? 'rgb(240, 255, 230)' : '' }}
                        />
                        <div className={styles.notification}>
                            {/* 안내 문구 */}
                            {
                                apiResponse.valid_cnt
                                    ?
                                    <span style={{ color: 'green' }}>인증이 완료되었습니다. 더 이상 수정할 수 없습니다.</span>
                                    :
                                    <span className={styles.errorMessage}>기업인증 필수 항목</span>
                            }
                        </div>
                    </div>
                </li>
            </ul>
            {/* 인증버튼 및 확인문구 */}
            <div>
                <div style={{ display: 'flex', margin: '10px 20px 10px 20px', alignItems: 'center', gap: '16px' }}>
                    {/* 인증버튼 */}
                    <button
                        style={{ width: '10em' }}
                        className='original_button' onClick={() => {
                            callCheckCorInfoApi(
                                props.inputData.corporationData.cor_num,
                                props.inputData.corporationData.cor_startDate,
                                props.inputData.corporationData.cor_ceoName,
                            );
                        }
                        }>기업정보 인증</button>
                    {/* 확인문구 */}
                    {
                        isCallApi ?
                            apiResponse.valid_cnt
                                ?
                                <strong style={{ color: 'green' }}>인증이 완료되었습니다.</strong>
                                :
                                <strong style={{ color: 'red' }}>국세청에 등록되지 않은 기업 정보입니다.</strong>
                            :
                            null
                    }
                </div>
            </div>
            <br />
            {/* -----------------------------기업 정보----------------------------- */}
            {/* -----------------------------기업 정보----------------------------- */}
            <div className={styles.indivisualMembers}>기업정보</div>
            <ul className={styles.inputWrap}>
                {/* 기업명 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>기업명</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder={'예) OO전자'}
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
                            style={{ backgroundColor: customRegex.test(props.inputData.corporationData.cor_corName) ? 'rgb(240, 255, 230)' : '' }}
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
                            placeholder={'예) 010'}
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
                            placeholder={'예) 1234'}
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
                            placeholder={'예) 5678'}
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
                    </div>
                </li>

                {/* 업태 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>업태</div>
                    <div className={styles.right}>
                        <input
                            className='basic_input'
                            type='text'
                            placeholder='도매 및 소매업'
                            value={props.inputData.corporationData.cor_sector}
                            onChange={(e) => props.setInputData(prevData => (
                                {
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_sector: e.target.value
                                    }
                                }
                            ))}
                            style={{ backgroundColor: customRegex.test(props.inputData.corporationData.cor_sector) ? 'rgb(240, 255, 230)' : '' }}
                        />
                    </div>
                </li>
                {/* 종목 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>종목</div>
                    <div className={styles.right}>
                        <input
                            className="basic_input"
                            type='text'
                            placeholder='예) 연마재, 안전용품'
                            value={props.inputData.corporationData.cor_category}
                            onChange={(e) => props.setInputData(prevData => (
                                {
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_category: e.target.value
                                    }
                                }
                            ))}
                            style={{ backgroundColor: customRegex.test(props.inputData.corporationData.cor_category) ? 'rgb(240, 255, 230)' : '' }}
                        />
                    </div>
                </li>
                {/* FAX */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>FAX</div>
                    <div className={styles.right}>
                        {/* 첫자리 */}
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder='예)052'
                            maxLength='4'
                            size='8'
                            value={props.inputData.corporationData.cor_fax.fax_num1}
                            onChange={e => props.setInputData(prevData => (
                                {
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_fax: {
                                            ...prevData.corporationData.cor_fax,
                                            fax_num1: e.target.value
                                        }
                                    }
                                }
                            ))}
                        />
                        {/* 가운데 */}
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder='예)1234'
                            maxLength='4'
                            size='8'
                            value={props.inputData.corporationData.cor_fax.fax_num2}
                            onChange={e => props.setInputData(prevData => (
                                {
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_fax: {
                                            ...prevData.corporationData.cor_fax,
                                            fax_num2: e.target.value
                                        }
                                    }
                                }
                            ))}
                        />
                        {/* 마지막 */}
                        <input
                            className={styles.phoneNum}
                            type='text'
                            placeholder='예)5678'
                            maxLength='4'
                            size='8'
                            value={props.inputData.corporationData.cor_fax.fax_num3}
                            onChange={e => props.setInputData(prevData => (
                                {
                                    ...prevData,
                                    corporationData: {
                                        ...prevData.corporationData,
                                        cor_fax: {
                                            ...prevData.corporationData.cor_fax,
                                            fax_num3: e.target.value
                                        }
                                    }
                                }
                            ))}
                        />
                    </div>
                </li>

                {/* 회원구분 체크박스 */}
                <li className={styles.inputContainer}>
                    <div className={styles.left}>회원구분</div>
                    <div className={styles.right}>
                        <div className='basic_input'>
                            <div className={styles.typeMember}>
                                <label htmlFor="endUser">
                                    <input
                                        type="radio"
                                        id="endUser"
                                        name="userType"
                                        value={props.inputData.userType}
                                        checked={props.inputData.userType_id === 1}
                                        onChange={() => {
                                            props.setInputData(
                                                (prevData) => ({ ...prevData, userType_id: 1 })
                                            )
                                        }}
                                    />
                                    실사용자</label>
                            </div>
                            <div className={styles.typeMember}>
                                <label htmlFor="suplier">
                                    <input
                                        type="radio"
                                        id="suplier"
                                        name="userType"
                                        value={props.inputData.userType}
                                        checked={props.inputData.userType_id === 2}
                                        onChange={() => {
                                            props.setInputData(
                                                (prevData) => ({ ...prevData, userType_id: 2 })
                                            )
                                        }}
                                    />
                                    납품</label>
                            </div>
                        </div>
                    </div>
                </li>
            </ul >
        </div >
    )
}