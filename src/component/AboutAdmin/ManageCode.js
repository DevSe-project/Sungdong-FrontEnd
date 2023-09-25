import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ManageCode.module.css';
import { AdminHeader } from "./AdminHeader";
import { AdminMenuData } from "./AdminMenuData";

export default function Managecode() {

  const navigate = useNavigate();

  // [목록] 발급된 코드리스트를 담을 State
  const [codeListObj, setCodeListObj] = useState([
    {
      id: 0,
      code: '1a2b3c4d',
    },
  ])

  // [API] 랜덤 코드 발급 API
  function printRandomCode(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  // [발급] 랜덤코드 발급
  const randomCode = () => {
    let newCode; //const는 한 번 할당한 후에 값을 변경할 수 없는 상수 변수를 선언할 때 사용
    let checkedCode; //반복적으로 값을 변경해야 하므로 let으로 선언
    // 중복코드가 없을 때까지 반복
    do {
      newCode = printRandomCode(8);
      checkedCode = codeListObj.find((codeItem) => codeItem.code === newCode);
    } while (checkedCode);
    // 새 코드를 기존 코드리스트에 추가
    setCodeListObj(prevCodeListObj => [...prevCodeListObj, {
      id: codeListObj.length,
      code: newCode,
    },
    ])
  }

  // [삭제] 발급된 코드 삭제
  const removeCode = (index) => {
    const updatedCodeList = [...codeListObj];
    updatedCodeList.splice(index, 1); //splice오랜만이고~
    setCodeListObj(updatedCodeList); //잘라줬으니 업데이트
  }

  useEffect(() => {
    // [저장] 코드목록이 변경될 때마다 세션에 저장
    sessionStorage.setItem('savePrintCodeList', JSON.stringify(codeListObj));
  }, [codeListObj]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 세션 스토리지에서 코드 목록을 불러옴
    const savedCodeList = JSON.parse(sessionStorage.getItem('savePrintCodeList')) || [];
    setCodeListObj(savedCodeList);
  }, []);


  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <div className={styles.sideContents}>
          <AdminMenuData />
        </div>
        <div className={styles.mainContents}>
          <h2>발급된 코드 / 관리</h2>
          <button onClick={randomCode}>코드발급</button>
          <div>
            {codeListObj.map((item, index) => {
              return <div>
                <div key={index}>{index} - {item.code}</div>
                <button onClick={() => { removeCode(index) }}>삭제</button>
              </div>
            })}
          </div>
          <button onClick={() => {
            const callPrintedCodeList = sessionStorage.getItem('savePrintCodeList');
            console.log(callPrintedCodeList);
          }}>저장된 세션 확인(console)</button>
          <button onClick={() => { navigate('/') }}>홈으로 가기</button>
        </div>
      </div>

    </div>
  )
}