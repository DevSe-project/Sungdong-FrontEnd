import React, { useEffect, useState } from 'react';
import styles from './Notice.module.css';
import NoticeDetail from './NoticeDetail';
import { useListActions, useModalActions, useModalState } from '../../store/DataStore';
import axios from '../../axios';
import { useFetch } from '../../customFn/useFetch';
import { useQuery } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';

export function Notice() {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 담습니다.
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [totalPages, setTotalPages] = useState(1);
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen, setSelectedIndex } = useModalActions();
  const {setNoticePostList} = useListActions();

  // 서버 API
  const { fetchGetServer } = useFetch();

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
    queryKey: [`notice`],
    queryFn: () => fetchNoticeData()
  })



  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div>
      <div className={styles.noticeContainer}>
        {/* --------------header-------------- */}
        <div className={styles.header}>
          <h1 className={styles.title}>공지사항</h1>
          <div className={styles.searchContainer}>
            <label className={styles.search_label} htmlFor="search">검색:</label>
            <input
              className={styles.search_input}
              type="text"
              id="search"
              placeholder="검색어를 입력하세요"
            />
          </div>
        </div>
        {/* --------------listContainer-------------- */}
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {noticeData?.map((item, index) => (
              <tr
                key={index}
                onClick={() => { selectedModalOpen('noticeDetail'); setSelectedIndex(index); setNoticePostList(item); }}
                tabIndex={0} // 이렇게 하면 포커스를 받을 수 있게 됩니다
              >
                <td>{index + 1}</td>
                <td>{item.post_title}</td>
                <td>{item.post_writer}</td>
                <td>{item.formatted_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* --------------Detail-Modal-------------- */}
        {isModal && modalName === 'noticeDetail' ?
          <div className={styles.modalOverlay}>
            <NoticeDetail />
          </div>
          : null}
      </div>
    </div>
  );
}
