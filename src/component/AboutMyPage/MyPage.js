import { useEffect, useState } from "react";
import { TopBanner } from "../AboutHeader/TopBanner";
import styles from "./Mypage.module.css";
export default function MyPage(props) {

  const [userProfile, setUserProfile] = useState([]);
  const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
  // 현재 로그인 된 유저의 데이터를 호출
  useEffect(() => {
    if (props.login) { //저장된 로그인Data가 존재
      if (props.userData) { //데이터 로딩 시간을 1500ms로 지정해놨기 때문에 불러들였다면, 표
        const findUser = props.userData.find(userData => userData.id == inLogin.id);
        if (findUser) {
          // 사용자 데이터를 state에 저장
          setUserProfile(findUser);
          console.log(userProfile);
        }
      }
    }
  }, [inLogin, props.userData])
  // 조건에 부합하는 해당 유저의 데이터를 호출
  return (
    <div>
      {/* 탑배너 & 카테고리 */}
      <TopBanner data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} text_dynamicStyle={props.text_dynamicStyle} />
      {/* 마이페이지 body */}
      <div className={styles.body}>
        {/* 내 정보(수정) */}
        <div className={styles.title}>내 정보</div>
        <div className={styles.subtitle}>개인정보수정</div>
        <table className={styles.table}>
          {/* 상호명 | 대표자 |  사업자번호 */}
          <tr className={styles.tr}>
            <th className={styles.th}>상호명</th>
            <td className={styles.td}>{userProfile.name}</td>
            <th className={styles.th}>대표자</th>
            <td className={styles.td}>장민욱</td>
            <th className={styles.th}>사업자번호</th>
            <td className={styles.td}>250-81-59602</td>
          </tr>
          {/* 아이디 | 비밀번호 | 이메일 */}
          <tr className={styles.tr}>
            <th className={styles.th}>아이디</th>
            <td className={styles.td}>{userProfile.id}</td>
            <th className={styles.th}>비밀번호</th>
            <td className={styles.td}><button>비밀번호 확인/변경하기</button></td>
            <th className={styles.th}>E-MAIL</th>
            <td className={styles.td}>{userProfile.email}</td>
          </tr>
          {/* 업태 | 종목 */}
          <tr className={styles.tr}>
            <th className={styles.th}>업태</th>
            <td className={styles.td}>소프트웨어 개발 및 IT 서비스</td>
            <th className={styles.th}>종목</th>
            <td className={styles.td}>웹사이트 및 앱 개발</td>
            <th className={styles.th}></th>
            <td className={styles.td}></td>
          </tr>
          {/* 주소 | FAX | 전화번호 */}
          <tr className={styles.tr}>
            <th className={styles.th} id={styles.editAddress}>주소</th>
            <td className={styles.td}>울산광역시 동구 봉수로 101
            </td>
            <th className={styles.th}>FAX</th>
            <td className={styles.td}>1800-3904</td>
            <th className={styles.th}>전화번호</th>
            <td className={styles.td}>{userProfile.num1}-{userProfile.num2}-{userProfile.num3}</td>
          </tr>
        </table>
      </div>
    </div>
  )
}