import React, { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import styles from './AdminUserList.module.css';
import axios from '../../../axios';
import { useModalActions, useModalState, useUserFilter, useUserSort } from '../../../Store/DataStore';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';
import { GetCookie } from '../../../customFn/GetCookie';

export default function AdminUserList() {

  const userFilter = useUserFilter(); // 유저필터 zustand
  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트
  const userSort = useUserSort(); // 유저정렬 zustand
  const [currentPage, setCurrentPage] = useState(1); // 게시물 데이터와 페이지 번호 상태 관리 
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [checkedItems, setCheckedItems] = useState([]); // 수정할 데이터의 체크 상태를 관리하는 state(users_id를 담음)
  const [sortBy, setSortBy] = useState([]); // 정렬 . . . 
  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state
  // AdminUserList 컴포넌트 내에서 editIndex 상태를 배열이 아닌 단일 값으로 선언합니다.
  const [editIndex, setEditIndex] = useState(null);

  // handleToggleEdit 함수를 수정하여 editIndex를 배열에서 단일 값으로 업데이트합니다.
  const handleToggleEdit = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  };


  const fetchMatchedData = () => {
    if (!checkedItems) {
      return;
    }
    const data = checkedItems.map(users_id => {
      const matchingData = userData.find(item => item.users_id === users_id);
      return matchingData;
    });
    setMatchedData(data);
  }

  useEffect(() => {
    fetchMatchedData();
  }, [checkedItems])


  // ------------------------------서버 통신------------------------------ //
  // 유저 데이터 Fetch
  const fetchUsersData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/auth/userAllOfPage`, {
        params: {
          page: currentPage,
          pagePosts: itemsPerPage
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data.message);
      return response.data.data.data;
    } catch (error) {
      throw new Error('배송 데이터 불러오기 중 오류가 발생하였습니다.');
    }
  }

  // useEffect를 사용하여 페이지 번호나 페이지 당 항목 수가 변경될 때마다 새로운 데이터를 가져옴
  useEffect(() => {
    fetchUsersData();
  }, [currentPage, itemsPerPage]);

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
  // 유저 필터링 handler
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
  //유저 정렬 Fetch
  const fetchSortedUserData = async (userFilterData) => {
    try {
      const response = await axios.post(
        "/auth/userSort",
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
      throw new Error('정렬할 순위가 없습니다.');
    }
  };
  // 유저 정렬 handler
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
  // 서버에 수정된 데이터를 반영하는 함수
  const fetchEditUserData = async (editedData) => {
    try {
      if (editedData) {
        // 수정된 데이터를 서버에 반영한다.
        const response = await axios.post(
          "/update", // 수정을 처리하는 API 엔드포인트
          editedData // 수정된 데이터
        );
        // 서버 응답을 받았을 때의 처리
        console.log('Update success:', response.data);
        alert('Update success');
        // 수정된 데이터를 서버에 반영한 후 해당 쿼리를 재호출하여 화면을 갱신한다.
        queryClient.invalidateQueries(['users']);
      } else {
        // 수정된 데이터가 없다면 경고 메시지를 표시한다.
        alert('No data to update');
      }
    } catch (error) {
      // 서버 요청 실패 시 에러 처리
      console.error('Update failed:', error);
      alert('Update failed');
    }
  };
  // 유저 수정 handler
  const editHandler = async (index) => {
    try {
      if (window.confirm('수정사항을 반영하시겠습니까?')) {
        // 수정할 데이터를 가져옴
        const userData = matchedData[index];
        // 수정된 데이터
        const editedData = '123';
        // 수정된 데이터를 서버에 반영
        await fetchEditUserData(userData);
      }
    } catch (error) {
      // 오류 처리
      console.error('유저 수정 실패:', error);
      alert('유저 수정에 실패했습니다.');
    }
  }
  // 유저 삭제 fetch
  const fetchDeleteUserData = async (id) => {
    try {
      const response = await axios.post(
        "auth/userDel",
        JSON.stringify(
          id
        ),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )

      return response.data;
    } catch (error) {
      throw new Error('고객 삭제 요청이 정상적으로 처리되지 않았습니다.');
    }
  }
  // 유저 삭제 handler
  const handleDelete = () => {
    if (window.confirm('선택된 고객을 정말 삭제하시겠습니까?')) {
      deleteMutation(checkedItems, {
        onSuccess: (data) => {
          console.log('user Delete successfully:', data);
          alert(data.message);
          queryClient.invalidateQueries(['users'], () => {
            return data.data
          })
        },
        onError: (error) => {
          console.error('user Delete failed:', error);
          alert(error.message);
        }
      })
    } else {
      alert('취소되었습니다');
    }
  }

  // 데이터 상태 관리
  const { isLoading, isError, error, data: userData } = useQuery({
    queryKey: [`users`, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchUsersData,
  });

  // mutate 정의
  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredUserData }); // 필터링
  const { mutate: sortMutation } = useMutation({ mutationFn: fetchSortedUserData }); // 정렬
  const { mutate: editMutation } = useMutation({ mutationFn: fetchEditUserData })
  const { mutate: deleteMutation } = useMutation({ mutationFn: fetchDeleteUserData }); // 삭제
  // ------------------------------서버 통신------------------------------ //

  // matchedData 업데이트 시 실행
  useEffect(() => {
    if (editIndex !== null) {
      const userData = matchedData[editIndex];
      if (userData) {
        fetchEditUserData(userData);
      }
    }
  }, [matchedData]);

  // 전체 체크박스 업데이트
  function handleAllCheckbox(isChecked) {
    const checked = isChecked;

    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      let idArray = userData?.map((item) => item.users_id);
      setCheckedItems(idArray);
      console.log(checkedItems);
    } else {
      // 모두 체킹 해제
      setCheckedItems([]);
      console.log(checkedItems);
    }
  }

  // 체크박스 개별 업데이트
  function handlePerCheckbox(checked, users_id) {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckedItems(prev => [...prev, users_id]);
      console.log(checkedItems);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckedItems(checkedItems.filter((el) => el !== users_id));
      console.log(checkedItems);
    }
  }

  const batchUpdateValue = (key, val) => {
    setMatchedData(prevData => {
      prevData.map(item => ({
        ...item,
        [key]: val
      }))
    })
  }

  const handleSelectChange = async (e) => {
    const { value } = e.target;
    // 선택된 값(value)과 체크된 항목(checkedItems)을 사용하여 일괄 변경 API 호출
    try {
      const response = await axios.post(
        "/auth/update",
        JSON.stringify({
          user_ids: checkedItems,
          update_value: value
        }),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      // 변경 성공 시 메시지 표시
      alert(response.data.message);
      // 변경된 데이터를 쿼리 데이터로 업데이트
      queryClient.setQueryData(['users'], () => {
        return response.data.updated_users;
      });
    } catch (error) {
      // 변경 실패 시 에러 메시지 표시
      console.error('일괄 변경 실패:', error);
      alert('일괄 변경에 실패했습니다.');
    }
  };

  useMemo(() => {
    // data나 sortBy가 변경될 때마다 정렬
    // handleSort();
  }, [userData, sortBy]);



  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
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

          <table style={{ marginTop: '10px' }}>
            <thead>
              <tr>
                {/* 전체 체크박스 관리 체크박스 */}
                <th><input
                  type='checkbox'
                  checked={checkedItems.length === userData.length ? true : false}
                  onChange={(e) => handleAllCheckbox(e.target.checked)} /></th>
                {/* 업체명(상호명) */}
                <th>업체명(상호명)</th>
                {/* 고객 구분, CMS여부 */}
                {[
                  { name: '고객 구분', valList: ['실사용자', '납품업자'] },
                  { name: '담당자', valList: ['박형조', '엄지석', '김태훈'], val: '박형조' },
                  { name: 'CMS여부', valList: ['A', 'B', 'C', 'D'] }
                ].map((customItem, index) => (
                  <th key={index}>
                    {editIndex == 'allEdit' ?
                      <>
                        <span>{customItem.name}</span>
                        <select className='select'>
                          <option value="">----</option> {/* 기본 옵션을 설정 */}
                          {customItem.valList.map((valList, valListIndex) => (
                            <option key={valListIndex} value={valList}>{valList}</option>
                          ))}
                        </select>
                      </>
                      :
                      customItem.name
                    }
                  </th>
                ))}
                {/* 주소 */}
                <th>주소</th>
                {/* 연락처 */}
                <th>연락처</th>
                {/* 메뉴 아이콘 */}
                <th style={{ width: '20px' }}>
                  {editIndex == 'allEdit' ?
                    <div className="dropdown-menu"> {/* 아이콘 */}
                      {/* 삭제 버튼 */}
                      <button className='white_button' onClick={() => handleDelete()}>삭제</button>
                      {/* 취소 버튼 */}
                      <button className='white_button' onClick={() => setEditIndex('none')}>취소</button>
                    </div>
                    :
                    <div className='icon' onClick={() => {
                      if (checkedItems.length) {
                        setEditIndex('allEdit');
                      } else {
                        alert('선택된 고객이 없습니다.');
                      }
                    }}><i class="fa-solid fa-ellipsis"></i></div>
                  }
                </th>
              </tr>
            </thead>
            <tbody>
              {userData?.map((user, index) => (
                <tr key={index}>
                  {/* 체크박스 */}
                  <td>
                    <input
                      type='checkbox'
                      checked={checkedItems.includes(user.users_id)}
                      onChange={(e) => handlePerCheckbox(e.target.checked, user.users_id)}
                    />
                  </td>
                  {/* 고객 구분, CMS여부 */}
                  {[
                    { name: '고객명', val: user.cor_corName },
                    { name: '고객 구분', valList: ['실사용자', '납품업자'], val: user.userType_id == 1 ? '실사용자' : '납품업자' },
                    { name: '담당자', valList: ['박형조', '엄지석', '김태훈'], val: '박형조' },
                    { name: 'CMS여부', valList: [true, false], val: user.hasCMS ? '동의' : '비동의' },
                  ].map((customItem, editIdx) => (
                    <td key={editIdx}>
                      {editIndex === index ?
                        customItem.valList ?
                          <select className='select'>
                            {customItem.valList.map((valList, valListIndex) => (
                              <option key={valListIndex} value={valList}>{valList}</option>
                            ))}
                          </select>
                          :
                          <input className='white_button' type='text' value={customItem.name} onChange={(e) => {

                          }} />
                        :
                        customItem.val
                      }
                    </td>
                  ))}

                  {/* 주소 */}
                  <td>{user.bname} {user.roadAddress}({user.zonecode})</td>
                  {/* 연락처 */}
                  <td>{user.cor_tel}</td>
                  {/* 수정/삭제 드롭다운 메뉴 */}
                  <td style={{ width: '20px' }}>
                    {index === editIndex
                      ?
                      <div className="dropdown-menu"> {/* 아이콘 */}
                        {/* 수정 버튼 */}
                        <button className='white_button' onClick={() => editHandler(user)}>수정</button>
                        {/* 삭제 버튼 */}
                        <button className='white_button' onClick={() => handleDelete(user)}>삭제</button>
                        {/* 취소 버튼 */}
                        <button className='white_button' onClick={() => setEditIndex(null)}>취소</button>
                      </div>
                      :
                      <div className='ellipsis' onClick={() => handleToggleEdit(index)}><i class="fa-solid fa-ellipsis"></i></div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
