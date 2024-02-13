import { useEffect, useState } from "react";
import styles from "./Mypage.module.css";
import ModifyPW from "./ModifyPW";
import { useModalState } from "../../store/DataStore";
import { useNavigate } from "react-router-dom";
import { GetCookie } from "../../customFn/GetCookie";
import { useQuery } from "@tanstack/react-query";
import axios from '../../axios';
import { useFetch } from "../../customFn/useFetch";

export default function MyPage(props) {

  const { isModal, openModal } = useModalState();

  const navigate = useNavigate();

  const { handleNoAlertOtherErrors, handleForbiddenError, handleOtherErrors } = useFetch();
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
      return response.data.data || {};
    } catch (error) {
      // 서버 응답이 실패인 경우
      if (error.response && error.response.status === 401) {
        // 서버가 401 UnAuthorazation를 반환한 경우
        handleNoAlertOtherErrors(error.response.data.message);
        return new Error(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    }
  }

  const { isLoading, isError, error, data: userProfile } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData
  });

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div>
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
  )
}