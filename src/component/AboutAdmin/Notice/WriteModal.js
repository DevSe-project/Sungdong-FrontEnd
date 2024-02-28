import styles from "./WriteEditModal.module.css";
import { useEffect, useState } from 'react';
import { useModalActions, useModalState, useNotice, useNoticeActions } from "../../../store/DataStore";
import { useFetch } from "../../../customFn/useFetch";
import { useQuery } from "@tanstack/react-query";
import axios from '../../../axios';
import { GetCookie } from "../../../customFn/GetCookie";

export default function WriteModal({ addPost }) {
  const { modalName } = useModalState();
  const { selectedModalClose } = useModalActions();

  const notice = useNotice();
  const { setNoticeData, resetNoticeData } = useNoticeActions();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedModalClose]);


  const { handleForbiddenError, handleOtherErrors, handleNoAlertOtherErrors } = useFetch();

  // -----UserData fetch
  /**
   * 
   * @returns 로그인된 users_id에 해당되는 users_info
   */
  const fetchLoginUserData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/notice/login/info",
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
  // userData fetch
  const { isUserLoading, isUserError, userError, data: loginUserData } = useQuery({
    queryKey: ['loginUser'],
    queryFn: fetchLoginUserData,
  });

  if (isUserLoading) {
    return <p>Loading..</p>;
  }

  if (isUserError) {
    return <p style={{ color: 'red' }}>User Error: {userError.message}</p>
  }

  return (
    <div className={styles.modalOveray}>
      <div className={styles.modalContainer}>
        {/* 종료 버튼 */}
        <div className={styles.closeButton}>
          <span onClick={() => {
            selectedModalClose(modalName);
            resetNoticeData();
          }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        {/* 모달 */}
        {/* 모달 내용 컨테이너 */}
        <div className={styles.contentsContainer}>
          {/* 제목 */}
          <div className={styles.title}>
            Title
            <input
              className={styles.inputTitle}
              type="text"
              value={notice.title} onChange={(e) => {
                setNoticeData("title", e.target.value)
              }}
              required />
          </div>
          {/* 작성자 */}
          <div className={styles.writer}>
            작성자 <input
              className={styles.inputWriter}
              type="text"
              value={loginUserData && loginUserData.name ? loginUserData.name : '사용자 정보 호출 실패'}
              onChange={() => {
                if (loginUserData && loginUserData.name.length > 0) {
                  console.log('사용자 정보 호출 성공');
                  setNoticeData("writer", loginUserData.name);
                }
                else {
                  console.log('사용자 정보 호출 실패');
                }
              }}
              required />
          </div>
          {/* 글 내용 */}
          <div className={styles.content}>
            <textarea
              className={styles.textarea}
              value={notice.contents}
              onChange={(e) => {
                setNoticeData("contents", e.target.value)
              }}>
            </textarea>
          </div>
        </div>

        {/* 첨부파일 */}
        <div className={styles.addFiles}>
          <input
            type="file"
            onChange={(e) => (
              setNoticeData("files", e.target.value)
            )} />
        </div>

        {/* 등록 버튼 */}
        <div
          className={styles.printPost}
          onClick={() => {
            addPost();
          }}>
          <div>등록</div>
        </div>
      </div>
    </div>
  );
}
