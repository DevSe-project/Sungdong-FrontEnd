import { useNavigate } from "react-router-dom";
import styles from './RelativeJoin.module.css';
import logo from '../../image/logo.jpeg'
import { useEffect, useState } from "react";
import PolicyObj from "../Data/PolicyObj";
import JoinForm from "./JoinForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import { GetCookie } from "../../customFn/GetCookie";


export default function Join() {

    // link_navigate 
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    //회원가입 추가 함수
    const joinRequest = async (joinData) => {
        try {
            const response = await axios.post("/auth/register",
                JSON.stringify({
                    // 전화번호
                    ...joinData,
                    tel: `${joinData.num1}-${joinData.num2}-${joinData.num3}`,
                    // 대표번호
                    ...joinData.corporationData,
                    cor_tel: `${joinData.corporationData.cor_tel.num1}-${joinData.corporationData.cor_tel.num2}-${joinData.corporationData.cor_tel.num3}`,
                    // FAX번호
                    ...joinData.corporationData.cor_fax,
                    cor_fax: `${joinData.corporationData.cor_fax.fax_num1}-${joinData.corporationData.cor_fax.fax_num2}-${joinData.corporationData.cor_fax.fax_num3}`,
                    // 주소
                    ...joinData.address,
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
            throw new Error('미 기입된 항목이 있습니다. 다시 확인해주세요..!');
        }
    };

    // 액세스 권한 불러오기
    const inAccess = GetCookie('register_code');

    // 최초 접근 권한검사 -> 코드인증으로 액세스 혀용에 따른 접근 불/허용
    useEffect(() => {
        if (inAccess !== null) {
            alert('접근 검사 : 인증이 완료되었습니다.');
        } else {
            alert('정상적인 접근이 아닙니다.')
            navigate('/login');
        }
    }, [navigate]);

    // [JoinForm.js에서 사용]입력받을 1회성 회원 정보
    let [inputData, setInputData] = useState(
        {
            userType_id: '',
            userId: '',
            userPassword: '',
            confirmPassword: '',
            email: '',
            emailService: false,
            name: '',
            num1: '',
            num2: '',
            num3: '',
            smsService: false,
            hasCMS: false,
            corporationData: {
                cor_ceoName: '', // 대표명
                cor_corName: '', // 상호명
                cor_startDate: '', // 개업연월일
                cor_tel: { // 회사 번호
                    num1: '',
                    num2: '',
                    num3: '',
                },
                cor_num: '', // 사업자번호
                cor_sector: '', // 업태
                cor_category: '', // 종목
                cor_fax: {
                    fax_num1: '',
                    fax_num2: '',
                    fax_num3: '',
                }, // FAX번호
                cor_corCopy: '',
                cor_bankCopy : ''
            },
            address: {
                zonecode: '',
                roadAddress: '',
                bname: '',
                buildingName: '',
                jibunAddress: '',
            },
            detailAddress: '',
        },
    )

    // 모든 체크박스의 상태를 체크되지 않은 상태, false로 설정
    let [checkboxState, setCheckboxState] = useState(() => PolicyObj.map(() => false));

    //모두 동의하기를 체크하면 이용약관 전체가 checked
    function checkedAll() {
        const allChecked = checkboxState.every(state => state); // 모든 체크박스가 true인지 확인
        const newCheckboxState = checkboxState.map(() => !allChecked); //반대값으로 변경
        setCheckboxState(newCheckboxState); //CheckboxState에 적용
    }

    // 약관상세보기, 개별동작하도록
    const [clauseState, setClauseState] = useState(() => PolicyObj.map(() => false)); //false로 초기값 통일
    function openDetailClause(index) {
        const newClause = [...clauseState];
        newClause[index] = !clauseState[index];
        setClauseState(newClause);
    };

    // [필수]항목들이 모두 체크되었는지 확인하는 함수
    const areAllRequiredChecked = checkboxState.every((state, index) => !PolicyObj[index].need || state);

    //경고문구 : 초기값(닫힌상태) - 아래의 삼항연산자를 움직일 State
    const [warningMsg, setWarningMsg] = useState(false)

    // [필수]항목들이 모두 체크됐는지 유무에 따라 warningMsg state를 조정하는 함수
    useEffect(() => {
        if (areAllRequiredChecked === false) {
            setWarningMsg(true);
        } else {
            setWarningMsg(false);
        }
    }, [areAllRequiredChecked])


    //회원가입 요청 함수
    const { mutate: joinMutate } = useMutation({ mutationFn: joinRequest });



    const signUp_checkCondition = () => {
        if (!areAllRequiredChecked) {
            alert('이용약관에 모두 동의해야 가입이 가능합니다.');
            return;
        }
        joinMutate(inputData, {
            onSuccess: (data) => {
                console.log('User created successfully:', data);
                // 다른 로직 수행 또는 상태 업데이트
                queryClient.invalidateQueries(['user']);
                navigate("/login");
                alert('성동물산에 오신 걸 환영합니다! 이제 로그인을 진행할 수 있습니다.');
            },
            onError: (error) => {
                console.error('User creation failed:', error);
                // 에러 처리 또는 메시지 표시
                alert(error);
            },
        });
    };

    return (
        <div className={styles.body}>

            {/* 로고 */}
            <div className={styles.logo}>
                <img
                    src={logo}
                    alt="쇼핑몰 로고"
                    onClick={() => { navigate("/") }}
                />
            </div>

            {/* 가입정보 입력 폼 */}
            <JoinForm inputData={inputData} setInputData={setInputData} />

            {/* 전체 동의하기 */}
            <div className={styles.checkAll}>
                <input
                    type="checkbox"
                    id="allCheck"
                    checked={checkboxState.every(state => state)}
                    onChange={() => {
                        checkedAll();
                    }} />
                <label htmlFor="allCheck">모두 동의하기</label>
            </div>

            {/* 이용약관 체크박스 컨테이너 */}
            <ul className={styles.policyContainer}>
                {/* 약관 Container */}
                {PolicyObj.map((policy, index) => {
                    return <li key={index} className={styles.li_policy}>
                        <div className={styles.eachContent}>
                            {/* 왼쪽 Content*/}
                            <div className={styles.leftContent}>
                                {/* 체크박스 */}
                                <input
                                    type="checkbox"
                                    id={`policyCheckbox_${index}`}
                                    checked={checkboxState[index]}
                                    onChange={() => {
                                        const newCheckboxState = [...checkboxState]; // 초기 전체 false인 상태를 카피
                                        newCheckboxState[index] = !newCheckboxState[index]; //클릭하면 해당인덱스의 state값을 반전
                                        setCheckboxState(newCheckboxState); //적용
                                    }} />
                                {/* policyNeed : need의 boolean값에 따라 색상을 다르게(선택,필수) */}
                                <label htmlFor="policyCheckbox">
                                    {policy.need ? <em style={{ color: "#FF3333" }}>[필수]</em> : <em style={{ color: "gray" }}>[선택]</em>}
                                </label>
                                {/* policyName */}
                                <label htmlFor={`policyCheckbox_${index}`}> {policy.policyName} </label>
                            </div>
                            {/* 오른쪽 Content */}
                            <div className={styles.rightContent}>
                                {/* 이용약관 상세보기 */}
                                <div className={styles.clause} onClick={() => openDetailClause(index)}>
                                    {clauseState[index] ? "▼약관 상세보기" : "▶약관 상세보기"}
                                </div>
                            </div>
                        </div>
                        {/* 보기를 클릭했을 때 나타나는 이용약관 */}
                        <div>
                            {clauseState[index] ?
                                <div className={styles.policyDetail}>
                                    {policy.policyDetail}</div> :
                                <div className={styles.policyDetail_null}
                                />}
                        </div>
                    </li>
                })}

            </ul>

            {/* 가입절차가 완료되지 않았을 때 경고문구 출력 */}
            {warningMsg ? <div className={styles.warningMsg}>아직 가입절차가 모두 진행되지 않았습니다.</div> : null}

            {/* moveContainer */}
            <div className={styles.moveContainer}>
                {/* 취소 */}
                <div className={styles.back} onClick={() => { navigate('/login') }}>
                    취소
                </div>
                {/* 가입하기 */}
                <div
                    className={`${styles.sign_up} ${!areAllRequiredChecked && styles.disabled}`}
                    onClick={() => signUp_checkCondition()}
                >
                    가입하기
                </div>
            </div>
        </div>
    )
}