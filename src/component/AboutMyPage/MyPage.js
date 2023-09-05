import { TopBanner } from "../AboutHeader/TopBanner";
import styles from "./Mypage.module.css";

export default function MyPage(props) {

  return (
    <div>
      {/* 탑배너 & 카테고리 */}
      <TopBanner iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} text_dynamicStyle={props.text_dynamicStyle} />
      {/* 마이페이지 body */}
      <div className={styles.body}>
        {/* 내 정보(수정) */}
        <div className={styles.title}>내 정보</div>
        <div className={styles.subtitle}>개인정보수정</div>
        <table className={styles.table}>
          {/* 상호명 | 대표자 |  사업자번호 */}
          <tr className={styles.tr}>
            <th className={styles.th}>상호명</th>
            <td className={styles.td}>대충 상호명</td>
            <th className={styles.th}>대표자</th>
            <td className={styles.td}>대충 대표자명</td>
            <th className={styles.th}>사업자번호</th>
            <td className={styles.td}>대충 사업자번호</td>
          </tr>
          {/* 아이디 | 비밀번호 | 이메일 */}
          <tr className={styles.tr}>
            <th className={styles.th}>아이디</th>
            <td className={styles.td}>대충 아이디</td>
            <th className={styles.th}>비밀번호</th>
            <td className={styles.td}>대충 비밀번호</td>
            <th className={styles.th}>E-MAIL</th>
            <td className={styles.td}>대충 이메일</td>
          </tr>
          {/* 업태 | 종목 */}
          <tr className={styles.tr}>
            <th className={styles.th}>업태</th>
            <td className={styles.td}>대충 업태임</td>
            <th>종목</th>
            <td className={styles.td}>대충 종목임</td>
          </tr>
          {/* 주소 | FAX | 전화번호 */}
          <tr className={styles.tr}>
            <th className={styles.th} id={styles.editAddress}>주소</th>
            <td className={styles.td}>대충 주소임
            <div>수정하기</div>
            </td>
            <th className={styles.th}>FAX</th>
            <td className={styles.td}>대충 FAX임</td>
            <th className={styles.th}>전화번호</th>
            <td className={styles.td}>대충 전화번호임</td>
          </tr>
        </table>
      </div>
    </div>
  )
}