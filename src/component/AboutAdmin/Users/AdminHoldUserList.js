import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './AdminUserManagement.module.css';
import axios from '../../../axios';
import { GetCookie } from '../../../customFn/GetCookie';
import { useFetch } from '../../../customFn/useFetch';

export default function AdminHoldUserList() {


  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트
  const [currentPage, setCurrentPage] = useState(1); // 게시물 데이터와 페이지 번호 상태 관리 
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [checkedItems, setCheckedItems] = useState([]); // 수정할 데이터의 체크 상태를 관리하는 state(users_id를 담음)
  
  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state
  // AdminUserList 컴포넌트 내에서 editIndex 상태를 배열이 아닌 단일 값으로 선언합니다.
  const [editIndex, setEditIndex] = useState(null);

  // 서버 Fetch
  const { fetchServer } = useFetch();

  // handleToggleEdit 함수를 수정하여 editIndex를 배열에서 단일 값으로 업데이트합니다.
  const handleToggleEdit = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  };
  // 편집 상태 & 입력된 정보 & 체크리스트 초기화
  const initializingData = () => {
    if (editIndex !== null) {
      setEditIndex(null);
      setCheckedItems([]);
    }
  }
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

  // ------------------------------서버 통신------------------------------ //
  // 유저 데이터 상태 관리
  const fetchUsersData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/auth/read/hold`, {
        params: {
          page: currentPage,
          pagePosts: itemsPerPage,
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data.message);
      return response.data.data.data;
    } catch (error) {
      throw new Error('고객 정보를 불러오는 중 오류가 발생하였습니다.');
    }
  }
  const { isLoading, isError, error, data: userData } = useQuery({
    queryKey: [`holdUsers`, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchUsersData,
  });

  useEffect(() => {
    if (userData)
      setMatchedData(userData);
  }, [userData]);

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
    queryClient.invalidateQueries('userData');
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
    queryClient.invalidateQueries(['users']);
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

  // 전체 체크박스 업데이트
  function handleAllCheckbox(isChecked) {
    const checked = isChecked;

    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      let idArray = matchedData?.map((item) => item.users_id);
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

  // 변경사항 업데이트
  const updateValue = (e, itemKey, itemIndex) => {
    console.log(checkedItems.length);
    // 여러 항목 업데이트
    if (checkedItems.length > 0) {
      const editData = e.target.value;
      const updateData = matchedData.map((item) => {
        // checkedItems에 포함된 사용자의 id와 일치하는 사용자의 데이터만 업데이트
        if (checkedItems.includes(item.users_id)) {
          return { ...item, [itemKey]: editData };
        }
        return item;
      });
      setMatchedData(updateData);
    }
    // 단일 항목 업데이트
    else {
      const editData = e.target.value;
      const newData = matchedData.map((item, idx) => {
        if (idx === itemIndex) {
          return { ...item, [itemKey]: editData };
        }
        return item;
      });
      setMatchedData(newData);
    }
  };

  const parseOptionValue = (item, listItem) => {
    if (item.key == 'userType_id') { // 고객구분
      switch (parseInt(listItem, 10)) {
        case 1:
          return <span>실사용자 A등급</span>;
        case 2:
          return <span>납품업자 A등급</span>;
        case 12:
          return <span>실사용자 B등급</span>;
        case 13:
          return <span>실사용자 C등급</span>;
        case 14:
          return <span>실사용자 D등급</span>;
        case 22:
          return <span>납품업자 B등급</span>;
        case 23:
          return <span>납품업자 C등급</span>;
        case 24:
          return <span>납품업자 D등급</span>;
        case 100:
          return <span>관리자</span>;
        default:
          return <span>Error</span>

      }
    } else if (item.key == 'hasCMS') { // CMS동의 여부
      if (listItem)
        return <span>동의</span>;
      else
        return <span>비동의</span>;
    }
    return <span>{listItem}</span>;
  }


  console.log(JSON.stringify(userData));



  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>오류가 발생했습니다.</div>;
  }



  return (
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
            { title: '담당자', valList: ['선택', '엄지석'], val: userData.managerName, key: 'managerName' },
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
                        {parseOptionValue(customItem, valListItem)}
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
            <td>
              {user.cor_corName}
            </td>
            {/* name: 상호명, val: db의 현재 값, valList: 선택할 값 */}
            {[
              { title: '고객 구분', valList: [1, 2, 12, 13, 14, 22, 23, 24, 100], val: user.userType_id, key: 'userType_id' },
              { title: '담당자', valList: ['선택', '엄지석'], val: user.managerName ? user.managerName : <span style={{ color: 'var(--main-red' }}>{user.managerName}</span>, key: 'managerName' },
              { title: 'CMS여부', valList: [1, 0], val: user.hasCMS, key: 'hasCMS' },
            ].map((customItem, editIdx) => (
              <td key={editIdx}>
                {editIndex === index ?
                  customItem.valList ?
                    <select
                      className='select'
                      value={customItem.val}
                      onChange={e => updateValue(e, customItem.key, index)}
                    >
                      {customItem.valList.map((item, index) => (
                        <option key={index} value={item}>{parseOptionValue(customItem, item)}</option>
                      ))}
                    </select>
                    :
                    <input
                      className='white_button'
                      type='text'
                      value={customItem.val}
                      onChange={(e) => {
                        const editData = e.target.value;
                        const newData = matchedData?.map((item, idx) => {
                          if (idx === index) {
                            return { ...item, [customItem.key]: editData };
                          }
                          return item;
                        });
                        setMatchedData(newData);
                      }}
                    />
                  :
                  parseOptionValue(customItem, customItem.val)
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
  )
}