import React, { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import styles from './AdminUserList.module.css';
import axios from '../../../axios';
import { useModalActions, useModalState, useUserFilter, useUserSort } from '../../../store/DataStore';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';
import { GetCookie } from '../../../customFn/GetCookie'
import { useFetch } from '../../../customFn/useFetch';


export default function AdminMyUserList() {

  const userFilter = useUserFilter(); // 유저필터 zustand
  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트
  const userSort = useUserSort(); // 유저정렬 zustand
  const { fetchServer } = useFetch();
  const [currentPage, setCurrentPage] = useState(1); // 게시물 데이터와 페이지 번호 상태 관리 
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [checkedItems, setCheckedItems] = useState([]); // 수정할 데이터의 체크 상태를 관리하는 state(users_id를 담음)
  const [sortBy, setSortBy] = useState([]); // 정렬 . . . 
  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state
  // AdminUserList 컴포넌트 내에서 editIndex 상태를 배열이 아닌 단일 값으로 선언합니다.
  const [editIndex, setEditIndex] = useState(null);

  //유저 필터링 Fetch
  const fetchFilteredUserData = async (userFilterData) => {
    try {
      const response = await axios.post("/auth/userFilter",
        JSON.stringify(
          userFilterData
        ),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('조건에 일치하는 유저가 없습니다.');
    }
  }
  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredUserData });
  const onFiltering = () => {
    filterMutation(userFilter, {
      onSuccess: (data) => {
        console.log('user Filtered successfully:', data);
        alert(data.message);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData(['users'], () => {
          return data.data
        })
      },
      onError: (error) => {
        console.error('user Filtered failed:', error);
        // 에러 처리 또는 메시지 표시
        alert(error.message);
      },
    });
  };

  // 정렬 
  const fetchSortedUserData = async (userFilterData) => {
    fetchServer(userFilterData, `post`, `/auth/userSort`, currentPage);
  };
  const { mutate: sortMutation } = useMutation({ mutationFn: fetchSortedUserData }); // 정렬
  const handleSort = () => {
    sortMutation(userSort, {
      onSuccess: (data) => {
        console.log('user Sorted successfully:', data);
        alert(data.message);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData(['users'], () => {
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


  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContainer}>
          <div className={styles.filtSortContainer}>
            <AdminUserFilter onFiltering={onFiltering} who='엄지석'/>
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

        </div>
      </div>
    </div>
  )
}