import { useEffect, useState } from "react";
import { TopBanner } from "../TemplateLayout/AboutHeader/TopBanner";
import styles from "./Mypage.module.css";
import ModifyPW from "./ModifyPW";
import { useModalState } from "../../Store/DataStore";
import { useNavigate } from "react-router-dom";
import { MenuData } from "../TemplateLayout/AboutMenuData/MenuData";
import { Footer } from "../TemplateLayout/AboutFooter/Footer";
import { GetCookie } from "../../customFn/GetCookie";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";
export default function MyPage(props) {

  const { isModal, openModal } = useModalState();

  const navigate = useNavigate();

  // -----UserData fetch
  const fetchUserData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get("/auth/info",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('확인 중 오류가 발생했습니다.');
    }
  }

  const { isLoading, isError, error, data: userProfile } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData
  });
  //-----UserData fetch

  // 유저 프로필 state 
  // const [userProfile, setUserProfile] = useState([]);

  // const userData = useUserData();

  // // 현재 로그인 된 유저의 데이터를 호출
  // useEffect(() => {
  //   if (inLogin) { //저장된 로그인Data가 존재
  //     if (userData) { //데이터 로딩 시간을 1500ms로 지정해놨기 때문에 불러들였다면, 표
  //       const findUser = userData.find(userData => userData.id == inLogin.id);
  //       if (findUser) {
  //         // 사용자 데이터를 state에 저장
  //         setUserProfile(findUser);
  //         console.log(userProfile);
  //       }
  //     }
  //   }
  // }, [props, inLogin, userData])

  // 조건에 부합하는 해당 유저의 데이터를 호출


  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

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
              <h1>{userProfile.cor_corName ? userProfile.cor_corName : '미 작성'} 정보</h1>
            </div>
            <div className={styles.subtitle}>
              <div>개인정보수정</div>
            </div>
            <table className={styles.table}>
              <tr className={styles.tr}>
                <th className={styles.th}>상호명</th>
                <td className={styles.td}>{userProfile.cor_corName && userProfile.cor_corName}</td>
                <th className={styles.th}>대표자</th>
                <td className={styles.td}>{userProfile.cor_ceoName && userProfile.cor_ceoName}</td>
                <th className={styles.th}>사업자번호</th>
                <td className={styles.td}>{userProfile.cor_num && userProfile.cor_num}</td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>아이디</th>
                <td className={styles.td}>{userProfile.userId && userProfile.userId}</td>
                <th className={styles.th}>비밀번호</th>
                <td className={styles.td}>
                  <button
                    onClick={() => {
                      openModal();
                    }}
                  >비밀번호 수정</button>
                </td>
                <th className={styles.th}>E-MAIL</th>
                <td className={styles.td}>{userProfile.email ? userProfile.email : '미 작성'}</td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th}>업태</th>
                <td className={styles.td}>{userProfile.cor_sector && userProfile.cor_sector}</td>
                <th className={styles.th}>종목</th>
                <td className={styles.td}>{userProfile.cor_sector && userProfile.cor_sector}</td>
                <th className={styles.th}></th>
                <td className={styles.td}></td>
              </tr>
              <tr className={styles.tr}>
                <th className={styles.th} id={styles.editAddress}>주소</th>
                <td className={styles.td}>{userProfile ? `${userProfile.roadAddress}(${userProfile.zonecode})` : '미 작성'}</td>
                <th className={styles.th}>FAX</th>
                <td className={styles.td}>{userProfile.cor_fax ? userProfile.cor_fax : '미 작성'}</td>
                <th className={styles.th}>전화번호</th>
                <td className={styles.td}>{userProfile.tel ? userProfile.tel : '미 작성'}</td>
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