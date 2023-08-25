import { useNavigate } from "react-router-dom";
import styles from './RelativeJoin.module.css';
import logo from '../../image/logo.jpeg'
import { useEffect, useState } from "react";
import PolicyObj from "../Data/PolicyObj";
import JoinForm from "./JoinForm";
import { UserData } from "../Data/UserData";

export default function Join(props) {
    // link_navigate
    let navigate = useNavigate();

    // 입력받을 회원 정보 객체배열 state
    let [inputData, setInputData] = useState([
        {
            id: '',
            password: '',
            confirmPassword: '',
            email: '',
            name: '',
            phoneNumber: {
                num1: '',
                num2: '',
                num3: '',
            },
            deliveryAddress: { postnum: '', address: '' },
        },
    ])

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
    function clause(index) {
        const newClause = [...clauseState];
        newClause[index] = !clauseState[index];
        setClauseState(newClause);
    };

    // [필수]항목들이 모두 체크되었는지 확인하는 함수
    function areAllRequiredChecked() {
        return checkboxState.every((state, index) => !PolicyObj[index].need || state);
        //.every(callback): 배열의 모든 요소가 주어진 콜백 함수를 만족하면 true를 반환하는 배열 메서드. 
        // every 메서드는 state 배열의 모든 요소가 특정 조건을 만족하는지 확인.
    }

    //경고문구 : 초기값(닫힌상태) - 아래의 삼항연산자를 움직일 State
    const [warningMsg, setWarningMsg] = useState(false)

    // [필수]항목들이 모두 체크됐는지 유무에 따라 warningMsg state를 조정하는 함수
    useEffect(() => {
        if (areAllRequiredChecked() === false) {
            setWarningMsg(true);
        } else setWarningMsg(false);
    })

    // 가입하기 버튼 클릭 event(가입s조건 모두 충족됐는지)
    let signUp_checkCondition = () => {
        // [필수]항목 체크확인
        if (areAllRequiredChecked()) {
            // 가입하기 버튼을 눌렀을 때, input받은 정보를 userData state에 저장하기 전 유효성 검사 실시.
            // if(props.inputData && UserData.find(item => item.id === props.inputData.id)) {
            //     console.log('중복된 아이디입니다.');
            // } else {
            //     console.log('사용가능한 아이디입니다.');
            // }
            props.setUserData(prevData => ({ //userData(UserData객체배열을 담은 state에 input받은 회원정보를 추가)
                ...prevData,
                id: props.inputData.id,
                password: props.inputData.pw,
                email: props.inputData.email,
                name: props.inputData.name,
                phoneNumber: {
                    num1: props.inputData.num1,
                    num2: props.inputData.num2,
                    num3: props.inputData.num3,
                },
                deliveryAddress: {
                    postnum: props.inputData.postnum,
                    address: props.inputData.address
                },
            }))
            console.log(props.userData);
            setWarningMsg(false); // 경고 메시지를 지우고
            navigate('/login');
            alert('성동물산에 오신 걸 환영합니다! 이제 로그인을 진행할 수 있습니다.');
        }
        else {
            setWarningMsg(false);
        }
    }

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

            {/* IndivisualMembers Form */}
            <JoinForm inputData={inputData} setInputData={setInputData} userData={props.userData} setUserData={props.setUserData} />

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
                {/* 이용약관 */}
                {PolicyObj.map((policy, index) => {
                    {/* 약관 Container */ }
                    return <li className={styles.li_policy}>
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
                                <div className={styles.clause} onClick={() => clause(index)}>
                                    {clauseState[index] ? "▼약관 상세보기" : "▶약관 상세보기"}
                                </div>
                            </div>
                        </div>
                        {/* 보기를 클릭했을 때 나타나는 이용약관 */}
                        <div>
                            {clauseState[index] ? <div className={styles.policyDetail}>{policy.policyDetail}</div> : <div className={styles.policyDetail_null} />}
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
                    className={`${styles.sign_up} ${!areAllRequiredChecked() && styles.disabled}`}
                    onClick={signUp_checkCondition}
                >
                    가입하기
                </div>
            </div>
        </div>
    )
}