
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ManageCode.module.css';
import { AdminHeader } from "../Layout/Header/AdminHeader";
import { AdminMenuData } from "../Layout/SideBar/AdminMenuData";

export default function Managecode() {

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

  // 12시간 후에 자동으로 코드 삭제
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const updatedCodeList = codeListObj.filter((codeItem) => {
        const codeTimestamp = codeItem.timestamp;
        const elapsedMilliseconds = currentTime - codeTimestamp;
        const elapsedHours = elapsedMilliseconds / (1000 * 60 * 60);
        return elapsedHours <= 12; // 12시간 이내의 코드만 유지
      });
      setCodeListObj(updatedCodeList);
    }, 1000 * 60 * 60); // 1시간마다 체크

    return () => clearInterval(interval);
  }, [codeListObj]);

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContents}>
          {/* 코드발급 | 최신코드 묶음 */}
          <div className={styles.print_new}>
            {/* 코드 발급 블록 */}
            <div className={styles.printCode_block}>
              <div className={styles.printCode_title}>Click <i class="fa-solid fa-arrow-down"></i></div>
              <div className={styles.printCode_button} onClick={randomCode}>코드발급</div>
            </div>
            {/* 뭐 넣을지 미정 */}
            <div className={styles.none_block}>
              <div className={styles.none_title}>
                Custom Title
              </div>
              <div className={styles.none_code}>
                Custom Contents
              </div>
            </div>
          </div>
          {/* 발행코드 목록 */}
          <div className={styles.printedCodeList_block}>
            {/* Title */}
            <div className={styles.printedCodeList_title}>발행 코드 LIST</div>
            {/* List */}
              {codeListObj.map((item, index) => (
                <div className={styles.printedCodeList_list}>
                  {/* No */}
                  <div className={styles.printedCodeList_no}
                    key={index}>
                    {index + 1}
                  </div>
                  {/* Code */}
                  <div className={styles.printedCodeList_code}
                    key={index}>
                    {item.code}
                  </div>
                  {/* Del */}
                  <div>
                    <div className={styles.printedCodeList_del}
                      onClick={() => { removeCode(index) }}>
                      삭제
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}