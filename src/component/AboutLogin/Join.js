import { Outlet, useNavigate } from "react-router-dom";
import styles from './Join.module.css';
import logo from '../../image/logo.jpeg'
import { useState } from "react";
import PolicyObj from "../Data/PolicyObj";
import { UserData } from "../Data/UserData";

export default function Join() {
    // link
    let navigate = useNavigate();

    // 입력받을 회원 정보 객체배열 state
    let [inputData, setInputData] = useState([
        {
            id: null,
            password: null,
            confirmPassword: null,
            email: null,
            name: null,
            phoneNumber: null,
        },
    ])
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
            email : newEmail
        }));
    };
    let handleName = (e) => { //이름
        const newName = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            name : newName
        }));
    };
    let handlePhoneNumber = (e) => { //전화번호
        const newPhoneNumber = e.target.value;
        setInputData(prevData => ({
            ...prevData,
            phoneNumber : newPhoneNumber
        }));
    };

    let confirmPassword = inputData.password === inputData.confirmPassword; //data 일치유무 체크


    // 가입하기 버튼 클릭 시, console & link
    let [joinState, setJoinState] = useState(false);
    let signUp = () => {
        navigate('/');
        alert("가입이 완료됐습니다. 환영합니다!");
    }

    // 모든 체크박스의 상태를 체크되지 않은 상태, false로 설정
    let [checkboxState, setCheckboxState] = useState(() => PolicyObj.map(() => false));
    //onCheck속성으로 모두 동의하기를 체크하면 전체가 체크되도록
    function checkedAll() {
        const allChecked = checkboxState.every(state => state); // 모든 체크박스가 true인지 확인
        const newCheckboxState = checkboxState.map(() => !allChecked); //반대값으로 변경
        setCheckboxState(newCheckboxState); //CheckboxState에 적용
    }

    // 약관상세보기, 개별동작하도록
    const [clauseState, setClauseState] = useState(() => PolicyObj.map(() => false));
    function clause(index) {
        const newClause = [...clauseState];
        newClause[index] = !clauseState[index];
        setClauseState(newClause);
    };

    // [필수]항목들이 체크되면 '가입하기'버튼이 활성화되도록.
    const [disabled, setDisabled] = useState(false); //css를 동작할 stats.
    // [필수]항목들이 모두 체크되었는지 확인하는 함수
    function areAllRequiredChecked() {
        return checkboxState.every((state, index) => PolicyObj[index].need ? state : true);
        //.every(callback): 배열의 모든 요소가 주어진 콜백 함수를 만족하면 true를 반환하는 배열 메서드. 
        // 이 메서드는 state 배열의 모든 요소가 특정 조건을 만족하는지를 확인합니다.
        // 앞으로 해야할 것. .every값이 true면 [필수]항목이 모두 체크 상태 -> 
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
            {/* 회원정보 입력란 */}
            <ul className={styles.inputWrap}>
                {/* 회원정보를 입력해주세요! */}
                <li className={styles.noti}>회원정보를 입력해주세요!</li>
                {/* 아이디 */}
                <li className={styles.setIdContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'아이디'}
                        value={inputData.id} 
                        onChange={ handleId }
                        />
                </li>
                <div className={styles.warnningMessage}>
                </div>
                {/* 비밀번호 */}
                <li className={styles.setPWContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'비밀번호'}
                        value={inputData.password}
                        onChange={ handlePassword }
                    />
                </li>
                {/* 비밀번호 확인 */}
                <li className={styles.setPWContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'비밀번호 재입력(일치 확인)'}
                        value={inputData.confirmPassword} 
                        onChange={ handleConfirmPassword }
                        />
                </li>
                {confirmPassword ? null : <div className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다!
                </div>}
                {/* 이메일 */}
                <li className={styles.setEmailContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'이메일'}
                        onChange={ handleEmail }
                    />
                </li>
                {/* 이름 */}
                <li className={styles.setNameContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'이름'} 
                        onChange={ handleName }
                    />
                </li>
                {/* 전화번호 */}
                <li className={styles.setNumberContainer}>
                    <input
                        className={styles.set}
                        type='text'
                        placeholder={'전화번호'} 
                        value={inputData.phoneNumber}
                        onChange={ handlePhoneNumber }
                    />
                </li>
                {/* 인증 요청- 누르면 하단에 인증번호 입력란이 나타나고 타이머 표시 */}
                <li
                    className={styles.requestSecurityNumberContainer}>
                    <div></div>
                </li>
            </ul>

            {/* 전체 동의하기 */}
            <div className={styles.checkAll}>
                <input
                    type="checkbox"
                    checked={checkboxState.every(state => state)}
                    onChange={checkedAll} />
                <div>모두 동의하기</div>
            </div>

            {/* 이용약관 체크박스 컨테이너 */}
            <ul className={styles.ul_policy}>
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
                                    checked={checkboxState[index]}
                                    onChange={() => {
                                        const newCheckboxState = [...checkboxState]; // 초기 전체 false인 상태를 카피
                                        newCheckboxState[index] = !newCheckboxState[index]; //클릭하면 해당인덱스의 state값을 반전
                                        setCheckboxState(newCheckboxState); //적용
                                    }} />
                                {/* policyNeed : need의 boolean값에 따라 색상을 다르게(선택,필수) */}
                                <span>
                                    {policy.need ? <em style={{ color: "#FF3333" }}>[필수]</em> : <em style={{ color: "gray" }}>[선택]</em>}
                                </span>
                                {/* policyName */}
                                <span> {policy.policyName} </span>
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
            {/* moveContainer */}
            <div className={styles.moveContainer}>
                {/* back */}
                <div className={styles.back} onClick={() => { navigate('/login') }}>
                    가입할 마음이 사라졌소 .
                </div>
                {/* next */}
                <div
                    className={styles.sign_up}
                    onClick={signUp}

                >
                    가입하기
                </div>
            </div>
        </div>
    )
}