import styles from './AdminUser.module.css';
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminUserFilter from './AdminUserFilter';
import AdminUserSort from './AdminUserSort';
import useManagerUser from './customFn/useManageUser';
import axios from '../../../axios';
import { usePageAction, usePageState } from '../../../store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';


export default function AdminDoneUser() {

  const { itemsPerPage, currentPage } = usePageState();
  const { setItemsPerPage } = usePageAction();

  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트

  // UserManageFunctions Store :: 고객관리에 필요한 함수 스토어
  const {
    editIndex, setEditIndex,
    checkedItems, setCheckedItems,
    matchedData, setMatchedData,
    handleToggleEdit,
    initializingData,
    handleEdit, handleBulkEdit,
    handleDelete,
    handleAllCheckbox, handlePerCheckbox,
    onDoneFiltering, handleDoneSort,
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

  // ------------------------------서버 통신------------------------------ //
  // 유저 데이터 상태 관리
  const fetchUsersData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/auth/read/done`, {
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
    queryKey: [`doneusers`, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchUsersData,
  });

  useEffect(() => {
    if (userData)
      setMatchedData(userData);
  }, [userData, itemsPerPage, currentPage]);


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
        <AdminUserSort onSort={handleDoneSort} />
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
              { title: '담당자', valList: ['초기화', '엄지석'], val: userData.managerName, key: 'managerName' },
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
                { title: '담당자', valList: ['초기화', '엄지석'], val: user.managerName ? user.managerName : <span style={{ color: 'var(--main-red' }}>{user.managerName}</span>, key: 'managerName' },
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

    </div >
  );
}
