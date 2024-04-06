import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './AdminUserManagement.module.css';
import { useUserSort } from '../../../store/DataStore';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';
import { useFetch } from '../../../customFn/useFetch';
import { Outlet } from 'react-router-dom';

export default function AdminUserList() {



  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트
  const [currentPage, setCurrentPage] = useState(1); // 게시물 데이터와 페이지 번호 상태 관리 
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [totalPages, setTotalPages] = useState(); // 총 페이지 개수
  const { fetchServer } = useFetch();
  const userSort = useUserSort(); // 유저정렬 zustand
  const [sortBy, setSortBy] = useState([]); // 정렬 . . . 


  //유저 필터링 Fetch
  /**]
   * @param {userFilterData} 유저 필터창의 Input된 데이터
   */
  const fetchFilteredUserData = async (userFilterData) => {
    console.log(userFilterData);
    return await fetchServer(userFilterData, `post`, `/auth/filter`, currentPage);

  }
  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredUserData });
  const onFiltering = (userFilter) => {
    console.log(`전달할 때 값: ${userFilter.cor_ceoName}`)
    filterMutation(userFilter, {
      onSuccess: (data) => {
        console.log('고객 필터링이 성공적으로 완료되었습니다.\n', data.data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['users', currentPage, itemsPerPage], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        console.error('필터링에 실패했습니다.\n', error);
        // 에러 처리 또는 메시지 표시
        alert(error.message);
      },
    });
  };


  // 정렬 
  const fetchSortedUserData = async (userFilterData) => {
    fetchServer(userFilterData, `post`, `/auth/sort`, currentPage);
  };
  const { mutate: sortMutation } = useMutation({ mutationFn: fetchSortedUserData }); // 정렬
  const handleSort = () => {
    sortMutation(userSort, {
      onSuccess: (data) => {
        console.log('user Sorted successfully:', data);
        alert(data.message);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData(['users', currentPage, itemsPerPage], () => {
          return data.data
        })
      },
      onError: (error) => {
        console.error('user Sorted failed:', error);
        // 에러 처리 또는 메시지 표시
        alert(error.message);
      },
    });
  };


  // useMemo(() => {
  //   // data나 sortBy가 변경될 때마다 정렬
  //   // handleSort();
  // }, [sortBy]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.filtSortContainer}>
        <AdminUserFilter onFiltering={onFiltering} />
        <AdminUserSort sortBy={sortBy} onSort={handleSort} />
      </div>
      {/* Header */}
      <div className='MediumHeader'>
        <div className='HeaderTxt'>
          목록
        </div>
        <select
          className='select'
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      <Outlet />

    </div >
  );
}
