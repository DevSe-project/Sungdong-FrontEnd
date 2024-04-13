import styles from './AdminUser.module.css';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';
import { useModalActions, useModalState, usePageAction, usePageState, useUserFilter, useUserSort } from '../../../store/DataStore';
import useManagerUser from './customFn/useManageUser';
import { useFetch } from '../../../customFn/useFetch';
import UserDetailInfo from './UserDetailInfo';
import axios from '../../../axios';


export default function AdminDoneUser() {

  const {
    fetchServer, // 사용처 : 필터링, 정렬 API
    fetchGetServer // 사용처 : 유저정보요청 API
  } = useFetch();

  const { itemsPerPage, currentPage, totalPages } = usePageState();

  const { setItemsPerPage, setCurrentPage, setTotalPages } = usePageAction();

  const { isModal, modalName, selectedIndex } = useModalState()
  const { selectedModalOpen, setSelectedIndex } = useModalActions();

  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트

  // UserManageFunctions Store :: 고객관리에 필요한 함수 스토어
  const {
    editIndex, setEditIndex,
    checkedItems, setCheckedItems,
    matchedData, setMatchedData,
    handleToggleEdit,
    initializingData,
    handleAllCheckbox, handlePerCheckbox,
    updateValue,
    parseOptionValue
  } = useManagerUser();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        initializingData();
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [initializingData]);

  // ------------------------------Fetch------------------------------ //



  // 유저 데이터 Fetch
  const fetchUsersData = async () => {
    try {
      const data = await fetchGetServer('/auth/read/done', currentPage);
      return data.data;
    } catch (error) {
      throw new Error('고객 정보를 불러오는 중 오류가 발생하였습니다.');
    }
  }
  const { isLoading, isError, error, data: userData } = useQuery({
    queryKey: [`doneusers`, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchUsersData,
  });

  useEffect(() => {
    if (userData)
      setMatchedData(userData);
  }, [userData, itemsPerPage, currentPage]);


  console.log(userData);



  // ------------------------고객정보 업데이트 기능 시작------------------------ //
  // 고객 단일 수정
  const handleEdit = async (userData) => { // 
    try {
      const confirmMessage = '수정사항을 반영하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;

      await editMutation(userData);
      window.location.reload();
    } catch (error) {
      console.error('유저 수정 실패:', error);
      alert('유저 수정에 실패했습니다.');
    }
  };
  // 전체 수정 함수(정상작동 확인))
  const handleBulkEdit = async () => {
    try {
      const confirmMessage = '수정사항을 반영하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
      const bulkUserData = []; // 수정된 데이터를 담을 배열을 초기화
      // 선택된 모든 사용자의 수정된 데이터를 추출하여 배열에 추가합니다.
      checkedItems.forEach((checkedID) => {
        const editedUserData = matchedData.find((user) => user.users_id === checkedID);
        bulkUserData.push(editedUserData);
      });
      await editMutation(bulkUserData); // 수정된 사용자 데이터 서버로 전송
    } catch (error) {
      console.error('전체 수정 실패:', error);
      alert('전체 수정에 실패했습니다.');
    }
  };
  const handleEditSuccess = (data) => { // 수정 성공
    console.log('수정 성공:', data);
    alert('수정이 완료되었습니다.');
    queryClient.invalidateQueries('doneusers');
    setEditIndex(null);
  };
  const handleEditError = (error) => { // 수정 실패
    console.error('수정 실패:', error);
    alert('수정에 실패했습니다.');
  };
  const fetchEditUser = async (userData) => { // Fetching
    try {
      const response = await axios.post('/auth/update', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const { mutate: editMutation } = useMutation({ // Mutation
    mutationFn: fetchEditUser,
    onSuccess: handleEditSuccess,
    onError: handleEditError,
  });
  // ------------------------고객정보 업데이트 기능 끝------------------------ //



  // ------------------------삭제 기능 시작------------------------ //
  // 고객 삭제
  const fetchDeleteUser = async (userID) => { // Fetching
    try {
      const response = await axios.delete(`/auth/delete/${userID}`,)
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  const handleDelete = async (userID) => { // 사용 부분
    try {
      const confirmMessage = '선택된 고객을 정말 삭제하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;

      await deleteMutation(userID);
    } catch (error) {
      handleDeleteError(error);
    }
  };
  const handleDeleteSuccess = (data) => { // 성공 시
    console.log('user Delete successfully:', data);
    alert(data.message);
    queryClient.invalidateQueries(['doneusers']);
    window.location.reload();
  };
  const handleDeleteError = (error) => { // 실패 시
    console.error('user Delete failed:', error);
    alert(error.message);
  };
  const { mutate: deleteMutation } = useMutation({ // Mutation
    mutationFn: fetchDeleteUser,
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
  });
  // ------------------------삭제 기능 끝------------------------ //




  // 필터링 데이터 Fetch
  const userFilter = useUserFilter();
  const fetchFilteredDoneUser = async (userFilter) => {
    console.log(userFilter);
    return await fetchServer(userFilter, `post`, `/auth/filtering/done`, currentPage);
  }
  const { mutate: filteringMutation } = useMutation({ mutationFn: fetchFilteredDoneUser });
  const onDoneFiltering = (userFilter) => {
    console.log(`전달할 때 값: ${userFilter.cor_ceoName}`)
    filteringMutation(userFilter, {
      onSuccess: (data) => {
        console.log('고객 필터링이 성공적으로 완료되었습니다.\n', data.data.data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['doneusers', currentPage, itemsPerPage], () => {
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



  // 정렬 데이터 Fetch
  const userSort = useUserSort();
  const fetchSortedDoneUser = async (userSort) => {
    // console.log(`선택된 정렬: ${userSort}`);
    console.log(userSort);
    return await fetchServer(userSort, `post`, `/auth/sorting/done`, currentPage);
  };
  const { mutate: sortingMutation } = useMutation({ mutationFn: fetchSortedDoneUser }); // 정렬
  const handleDoneSorting = () => {
    sortingMutation(userSort, {
      onSuccess: (data) => {
        // Debuggig Code : data.data.data
        console.log('고객 정렬이 성공적으로 완료되었습니다.\n', data.data.data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData(['doneusers', currentPage, itemsPerPage], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        console.error('user Sorted failed:', error);
        // 에러 처리 또는 메시지 표시
        alert(error);
      },
    });
  };


  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }


  return (
    <div className={styles.mainContainer}>
      <div className={styles.filtSortContainer}>
        <AdminUserFilter onFiltering={onDoneFiltering} />
        <AdminUserSort onSort={handleDoneSorting} />
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
            <th>
              <input
                type='checkbox'
                checked={checkedItems.length === matchedData?.length ? true : false}
                onChange={(e) => handleAllCheckbox(e.target.checked)}
              />
            </th>
            {/* 업체명(상호명) */}
            <th>업체명(상호명)</th>
            {/* 고객 구분, CMS여부 */}
            {[
              { title: '고객 구분', valList: [1, 2, 12, 13, 14, 22, 23, 24, 100], val: userData.userType_id, key: 'userType_id' },
              { title: '담당자', valList: ['엄지석'], val: userData.managerName, key: 'managerName' },
              { title: 'CMS여부', valList: [1, 0], val: userData.hasCMS, key: 'hasCMS' },
            ].map((customItem, index) => (
              <th key={index}>
                {editIndex === 'allEdit' ?
                  <>
                    <span>{customItem.title}</span>
                    <select
                      className='select'
                      value={customItem.val}
                      onChange={e => updateValue(e, customItem.key, index)}
                    >
                      <option value={null}>선택</option>
                      {customItem.valList.map((valListItem, valListIndex) => (
                        <option key={valListIndex} value={valListItem}>
                          {parseOptionValue(customItem.key, valListItem)}
                        </option>
                      ))}
                    </select>
                  </>
                  :
                  customItem.title
                }
              </th>
            ))}
            {/* 주소 */}
            <th>주소</th>
            {/* 연락처 */}
            <th>연락처</th>
            {/* 메뉴 아이콘 */}
            <th style={{ width: '20px' }}>
              {editIndex === 'allEdit' ?
                <div className={styles.RnD_handler}> {/* 아이콘 */}
                  {/* 수정 버튼 */}
                  <button className='white_round_button' onClick={() => { handleBulkEdit(); window.location.reload(); }}>수정</button>
                  {/* 삭제 버튼 */}
                  <button className='white_round_button' onClick={() => handleDelete(checkedItems)}>삭제</button>
                  {/* 취소 버튼 */}
                  <button className='white_round_button' onClick={() => {
                    setEditIndex('none');
                    setCheckedItems([]);
                  }}>취소</button>
                </div>
                :
                <div
                  className='icon'
                  style={{ paddingRight: '1em' }}
                  onClick={() => {
                    if (checkedItems.length) {
                      setEditIndex('allEdit');
                    } else {
                      alert('선택된 고객이 없습니다.');
                    }
                  }}><i className="fa-solid fa-ellipsis"></i></div>
              }
            </th>
          </tr>
        </thead>
        <tbody>
          {matchedData?.map((user, index) => (
            <tr key={index}>
              {/* 체크박스 */}
              <td>
                <input
                  type='checkbox'
                  checked={checkedItems.includes(user.users_id)}
                  onChange={(e) => handlePerCheckbox(e.target.checked, user.users_id)}
                />
              </td>
              {/* 업체명(상호명) : name */}
              <td onClick={() => {
                // 수정상태가 활성화되지 않은 상태에서만 모달이 작동하도록 합니다.
                if (editIndex != index) {
                  selectedModalOpen('doneuser'); // modalName 설정
                  setSelectedIndex(index); // index 동기화
                }
              }}>
                {user.cor_corName}
              </td>
              {/* name: 상호명, val: db의 현재 값, valList: 선택할 값 */}
              {[
                { title: '고객 구분', valList: [1, 2, 12, 13, 14, 22, 23, 24, 100], val: user.userType_id, key: 'userType_id' },
                { title: '담당자', valList: ['엄지석'], val: user.managerName && user.managerName || "렌더링 실패", key: 'managerName' },
                { title: 'CMS여부', valList: [1, 0], val: user.hasCMS, key: 'hasCMS' },
              ].map((customItem, editIdx) => (
                <td key={editIdx}>
                  {editIndex === index && customItem.valList ?
                    <select
                      className='select'
                      value={customItem.val}
                      onChange={e => updateValue(e, customItem.key, index)}
                    >
                      <option value={customItem.val}>
                        {parseOptionValue(customItem.key, customItem.val)}
                      </option>
                      {customItem.valList.map((item, index) => (
                        <option key={index} value={customItem.val}>
                          {parseOptionValue(customItem.key, item)}
                        </option>
                      ))}
                    </select>
                    :
                    parseOptionValue(customItem.key, customItem.val)
                  }
                </td>
              ))}
              {/* 주소 */}
              <td>{user.bname} {user.roadAddress}({user.zonecode})</td>
              {/* 연락처 */}
              <td>{user.cor_tel}</td>
              {/* 수정/삭제 드롭다운 메뉴 */}
              <td>
                {index === editIndex ? (
                  <div className={styles.RnD_handler}>
                    {/* 수정 버튼 */}
                    <button className='white_round_button' onClick={() => { handleEdit(user); console.log(user); }}>수정</button>
                    {/* 삭제 버튼 */}
                    <button className='white_round_button' onClick={() => handleDelete(user.users_id)}>삭제</button>
                    {/* 취소 버튼 */}
                    <button className='white_round_button' onClick={() => initializingData()}>취소</button>
                  </div>
                ) : (
                  <div
                    className='ellipsis'
                    style={{ paddingRight: '1em' }}
                    onClick={() => { handleToggleEdit(index); setCheckedItems([]); }}><i className="fa-solid fa-ellipsis"></i></div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Detail Information Modal*/}
      {isModal && modalName === 'doneuser' ?
        <UserDetailInfo info={matchedData[selectedIndex]} />
        :
        null
      }
    </div >
  );
}
