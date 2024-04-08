import React, { useState } from "react";
import { useListActions, useModalActions, useModalState, useNoticeActions, useNoticePostList } from "../../../store/DataStore";
import NoticeDetail from "../../AboutUserService/NoticeDetail";
import styles from "./AdminNoticeMini.module.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from '../../../axios';
import { GetCookie } from "../../../customFn/GetCookie";

export default function AdminNoticeMini() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 담습니다.
  const [itemsPerPage, setItemsPerPage] = useState(5); // 아아템 포스팅 개수
  const { isModal, modalName } = useModalState();
  const { setIsModal, setSelectedIndex, selectedModalOpen } = useModalActions();
  const { setNoticePostList } = useListActions();

  /**
 * 서버에 Posts 조회 요청을 보냅니다.
 * @param currentPage 현재 페이지
 * @param itemsPerPage 페이지당 포스팅 개수
 * @returns 
 */
  const fetchNoticeData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/notice/read`, {
        params: {
          page: currentPage,
          pagePosts: itemsPerPage
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      return response.data.data.data;
    } catch (error) {
      throw new Error('공지사항 정보를 불러오는 중 오류가 발생하였습니다.');
    }
  }

  const { isLoading, isError, error, data: noticeData } = useQuery({
    queryKey: [`noticeMini`],
    queryFn: () => fetchNoticeData()
  })

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.noticeMiniContainer}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #CC0000",
        alignItems: "center"
      }}>
        <span style={{
          fontSize: "20px",
          fontWeight: "bold",
        }}>공지사항</span>
        <span
          className={styles.view_all}
          onClick={() => { navigate('/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/customerCenter/notice') }}>관리하기</span>
      </div>
      <ol className={styles.noticeList}>
        {noticeData.map((item, index) => (
          <li
            key={index}
            className={styles.noticeItem}
            onClick={() => {
              selectedModalOpen('noticeDetail');
              setSelectedIndex(index);
              setNoticePostList(item);
            }} // 해당 모달 Open
          >
            <span className={styles.itemTitle}>{item.post_title}</span>
          </li>
        ))}
      </ol>

      {/* --------------Detail-Modal-------------- */}
      {isModal && modalName === 'noticeDetail' ?
        <div className="modalOverlay">
          <NoticeDetail />
        </div>
        : null}
    </div>
  );
}
