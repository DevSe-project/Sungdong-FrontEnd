import { useParsing } from '../../../customFn/useParsing';
import UserDetailInfo from './UserDetailInfo';
import styles from "./UserList/UserList.module.css";
import React, { useState } from 'react';
import { useModalState, useModalActions, usePageState, usePageAction, useCheckStoreActions, useCheckStoreState } from "../../../store/DataStore";



export default function AdminHoldUser({ matchedData, handleBulkEdit, handleEdit, handleToggleEdit, handleDelete, editIndex, setEditIndex, updateValue, initializingData, checkedItems, setCheckedItems, isAllCheckboxState, checkboxBatchHandler, checkboxEachHandler }) {


  const devideType = localStorage.getItem('devideType');
  const { itemsPerPage } = usePageState();
  const { setItemsPerPage } = usePageAction();
  const { isModal, modalName, selectedIndex } = useModalState()
  const { selectedModalOpen, setSelectedIndex } = useModalActions();
  const { parseUserType, parseCMS } = useParsing();
  


  return (
    <div className={styles.listView}>
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
                checked={isAllCheckboxState}
                onChange={checkboxBatchHandler}
              />

            </th>
            {/* 업체명(상호명) */}
            <th>업체명(상호명)</th>
            {/* 고객 구분, CMS여부 */}
            {[
              { title: '고객 구분', valList: [1, 2, 12, 13, 14, 22, 23, 24, 100], val: matchedData ? matchedData.userType_id : "요청실패", key: 'userType_id' },
              { title: '담당자', valList: ['엄지석'], val: matchedData ? matchedData.managerName : "요청실패", key: 'managerName' },
              { title: 'CMS여부', valList: [1, 0], val: matchedData ? matchedData.hasCMS : "요청실패", key: 'hasCMS' },
            ].map((customItem, index) => (
              <th key={index}>
                {editIndex !== 'allEdit'
                  ?
                  customItem.title
                  :
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
                          {customItem.key == 'userType_id' && parseUserType(valListItem)}
                          {customItem.key == 'hasCMS' && parseCMS(valListItem)}
                          {customItem.key == 'managerName' && customItem.val}
                        </option>
                      ))}
                    </select>
                  </>
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
                  onChange={e => checkboxEachHandler(user.users_id)}
                />
              </td>
              {/* 업체명(상호명) : name */}
              <td onClick={() => {
                // 수정상태가 활성화되지 않은 상태에서만 모달이 작동하도록 합니다.
                if (editIndex != index) {
                  selectedModalOpen(`${devideType}user`); // modalName 설정
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
                        {customItem.key == 'userType_id' && parseUserType(customItem.val)}
                        {customItem.key == 'hasCMS' && parseCMS(customItem.val)}
                        {customItem.key == 'managerName' && customItem.val}
                      </option>
                      {customItem.valList.map((item, index) => (
                        <option key={index} value={customItem.val}>
                          {customItem.key == 'userType_id' && parseUserType(customItem.val)}
                          {customItem.key == 'hasCMS' && parseCMS(customItem.val)}
                          {customItem.key == 'managerName' && customItem.val}
                        </option>
                      ))}
                    </select>
                    :
                    customItem.key === 'userType_id' ? parseUserType(customItem.val) : (
                      customItem.key === 'hasCMS' ? parseCMS(customItem.val) : customItem.val
                    )
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
      {isModal && modalName === `${devideType}user` ?
        <UserDetailInfo info={matchedData[selectedIndex]} />
        :
        null
      }
    </div >
  );
}
