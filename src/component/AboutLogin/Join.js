import { useNavigate } from "react-router-dom";
import styles from './RelativeJoin.module.css';
import logo from '../../image/logo.jpeg'
import { useState } from "react";
import PolicyObj from "../Data/PolicyObj";
import JoinPopUpMessage from "./JoinPopUpMessage.js"
import IndivisualMembers from "./IndivisualMembers";

export default function Join() {
    // link_navigate
    let navigate = useNavigate();

    // 모든 체크박스의 상태를 체크되지 않은 상태, false로 설정
    let [checkboxState, setCheckboxState] = useState(() => PolicyObj.map(() => false));
    //onCheck속성으로 모두 동의하기를 체크하면 전체가 체크되도록
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

    // 가입성공시 event
    const [showPopUp, setShowPopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    let signUp_checkCondition = () => {
        if (!areAllRequiredChecked()) {
            setPopUpMessage('아직 완료되지 않은 가입절차가 있습니다. 확인 후 다시 시도해주세요!');
        }
        else {
            navigate('/login');
            alert('환영합니다! 가입 절차를 모두 끝마쳤습니다. 성동물산에 방문해주셔서 감사합니다!');
        }
        setShowPopUp(true);
        setTimeout(() => {
            setShowPopUp(false);
        }, 2500);
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
            <IndivisualMembers />

            {/* 전체 동의하기 */}
            <div className={styles.checkAll}>
                <input
                    type="checkbox"
                    checked={checkboxState.every(state => state)}
                    onChange={checkedAll} />
                <div>모두 동의하기</div>
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

            {/* popUpMessage */}
            {showPopUp ? <JoinPopUpMessage popUpMessage={popUpMessage} popUpClose={() => setShowPopUp(false)} /> : null}

            {/* moveContainer */}
            <div className={styles.moveContainer}>
                {/* no signUp */}
                <div className={styles.back} onClick={() => { navigate('/login') }}>
                    취소
                </div>
                {/* signUp */}
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