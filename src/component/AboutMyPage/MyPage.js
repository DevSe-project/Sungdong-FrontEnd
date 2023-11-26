import { useEffect, useState } from "react";
import { TopBanner } from "../TemplateLayout/AboutHeader/TopBanner";
import styles from "./Mypage.module.css";
import ModifyPW from "./ModifyPW";
import { useIsLogin, useModalState, useUserData } from "../../Store/DataStore";
import { useNavigate } from "react-router-dom";
import { MenuData } from "../TemplateLayout/AboutMenuData/MenuData";
import { Footer } from "../TemplateLayout/AboutFooter/Footer";
export default function MyPage(props) {

  const { isModal, openModal } = useModalState();
  const { isLogin } = useIsLogin()

  const navigate = useNavigate();

  // 액세스 권한 불러오기
  const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));

  // 최초 접근 권한검사 -> 코드인증으로 액세스 혀용에 따른 접근 불/허용
  useEffect(() => {
    if (inLogin) {
      alert('인증이 완료되었습니다.');
    } else {
      alert('정상적인 접근이 아닙니다.')
      navigate('/login');
    }
  }, [navigate]);

  // 유저 프로필 state 
  const [userProfile, setUserProfile] = useState([]);

  const userData = useUserData();

  // 현재 로그인 된 유저의 데이터를 호출
  useEffect(() => {
    if (inLogin) { //저장된 로그인Data가 존재
      if (userData) { //데이터 로딩 시간을 1500ms로 지정해놨기 때문에 불러들였다면, 표
        const findUser = userData.find(userData => userData.id == inLogin.id);
        if (findUser) {
          // 사용자 데이터를 state에 저장
          setUserProfile(findUser);
          console.log(userProfile);
        }
      }
    }
  }, [props, inLogin, userData])

  // 조건에 부합하는 해당 유저의 데이터를 호출


  // 비밀번호 수정


  return (
    <div>
      {/* TOP */}
      <TopBanner
        iconHovered={props.iconHovered}
        iconMouseEnter={props.iconMouseEnter}
        iconMouseLeave={props.iconMouseLeave}
        icon_dynamicStyle={props.icon_dynamicStyle}
        text_dynamicStyle={props.text_dynamicStyle}
        category_dynamicStyle={props.category_dynamicStyle}
        iconOnClick={props.iconOnClick}
        menuOnClick={props.menuOnClick}
        menu_dynamicStyle={props.menu_dynamicStyle} />

      {/* Mid */}
      <div className={styles.mid}>
        {/* 메뉴 바 */}
        <MenuData menu_dynamicStyle={props.menu_dynamicStyle} />

        {/* Main */}
        {userProfile ? ( //coData 관련data는 조건부 렌더링하도록 
          <div className={styles.body}>
            <div className={styles.title}>
              <h1>{userProfile.name} 정보</h1>
            </div>
            <div className={styles.subtitle}>
              <div>개인정보수정</div>
            </div>
            <table className={styles.table}>
              <tr className={styles.tr}>
                <th className={styles.th}>상호명</th>
                <td className={styles.td}>{userProfile.name}</td>
                <th className={styles.th}>대표자</th>
                <td className={styles.td}>{userProfile.corporationData ? userProfile.corporationData.ceoName : ''}</td>
                <th className={styles.th}>사업자번호</th>
                <td className={styles.td}>{userProfile.corporationData ? userProfile.corporationData.businessNum : ''}</td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>아이디</th>
                <td className={styles.td}>{userProfile.id}</td>
                <th className={styles.th}>비밀번호</th>
                <td className={styles.td}>
                  <button
                    onClick={() => {
                      openModal();
                    }}
                  >비밀번호 수정</button>
                </td>
                <th className={styles.th}>E-MAIL</th>
                <td className={styles.td}>{userProfile.email}</td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>업태</th>
                <td className={styles.td}>{userProfile.corporationData ? userProfile.corporationData.businessSector : ''}</td>
                <th className={styles.th}>종목</th>
                <td className={styles.td}>{userProfile.corporationData ? userProfile.corporationData.businessCategory : ''}</td>
                <th className={styles.th}></th>
                <td className={styles.td}></td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th} id={styles.editAddress}>주소</th>
                <td className={styles.td}>{userProfile.address ? `${userProfile.address.roadAddress}(${userProfile.address.zonecode})` : ''}</td>
                <th className={styles.th}>FAX</th>
                <td className={styles.td}>{userProfile.corporationData ? userProfile.corporationData.FAX : ''}</td>
                <th className={styles.th}>전화번호</th>
                <td className={styles.td}>{`${userProfile.num1}-${userProfile.num2}-${userProfile.num3}`}</td>
              </tr>
            </table>
            {isModal
              ?
              <ModifyPW
              />
              :
              null}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* Bottom */}
      <Footer />
    </div>
  )
}