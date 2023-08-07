import { Outlet, useNavigate } from "react-router-dom";
import styles from './Join.module.css';
import logo from '../../image/logo.jpeg'
import { useState } from "react";
import PolicyObj from "../Data/PolicyObj";

export default function Join() {
    let navigate = useNavigate();

    // 가입하기
    let [joinState, setJoinState] = useState(false);
    let signUp = () => {
        setJoinState(!joinState);
        navigate('/join/inputInformation');
    }

    // 모든 체크박스의 상태를 체크되지 않은 상태, false로 설정
    let [checkboxState, setCheckboxState] = useState( () => PolicyObj.map( () => false) ); 
    //onCheck속성으로 모두 동의하기를 체크하면 전체가 체크되도록
    function checkedAll(index) {
        const allChecked = checkboxState.every(state => state); // 모든 체크박스가 true인지 확인
        const newCheckboxState = checkboxState.map( () => !allChecked); //반대값으로 변경
        setCheckboxState(newCheckboxState); //CheckboxState에 적용
    }

    // 화살표, 그리고 개별동작하도록
    const [arrowState, setArrowState] = useState( () => PolicyObj.map( () => false) );
    function arrow(index) {  
        const newArrow = [...arrowState];
        newArrow[index] = !arrowState[index];
        setArrowState(newArrow);
    };

    // [필수]항목들이 체크되면 '가입하기'버튼이 활성화되도록.
    function ifJoin() {

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

            {/* 전체 동의하기 */}
            <div className={styles.checkAll}>
                <input 
                type="checkbox"
                checked={checkboxState.every(state => state)} 
                onChange={checkedAll}/>
                <div>모두 확인하였으며 동의합니다.</div>
            </div>

            {/* 이용약관 체크박스 컨테이너 */}
            <div className={styles.checkboxContainer}>
                {/* 이용약관 */}
                {PolicyObj.map((policy, index) => {
                    // 각 정책List
                    return <div className={styles.policyList}>
                        <div className={styles.policyObj}>
                            <div>
                                {/* 체크박스 */}
                                <input 
                                type="checkbox"
                                checked={checkboxState[index]}
                                onChange={ () => {
                                    const newCheckboxState = [...checkboxState];
                                    newCheckboxState[index] = !newCheckboxState[index];
                                    setCheckboxState(newCheckboxState);
                                } } />
                                {/* 정책이름 */}
                                {policy.policyName}
                            </div>
                            {/* 이용약관 상세보기 */}
                            <div className={styles.arrow} onClick={ () => arrow(index)}>
                                {arrowState[index] ? "▼보기" : "▶보기"}
                            </div>
                        </div>
                        {/* 보기를 클랙했을 때 나타나는 이용약관 */}
                        <div>
                            {arrowState[index] ? <div className={styles.policyDetail}>{policy.policyDetail}</div> : null }
                        </div>
                    </div>
                })}

            </div>
            {/* moveContainer */}
            <div className={styles.moveContainer}>
                {/* back */}
                <div className={styles.back} onClick={() => { navigate('/login') }}>
                    가입할 마음이 사라졌소 .
                </div>
                {/* next */}
                <div className={styles.sign_up} onClick={signUp}>
                    가입하기
                </div>
            </div>
            {/* 가입정보 입력란 */}
            {joinState ? <Outlet /> : null}
        </div>
    )
}