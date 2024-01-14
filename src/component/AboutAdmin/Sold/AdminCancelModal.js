import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from '../../../Store/DataStore';
import { useQuery } from '@tanstack/react-query';

export default function AdminCancelModal() {

  const selectList = useOrderSelectList();
  const {setSelectListValue} = useOrderSelectListActions();

  const { modalName } = useModalState();
  const {selectedModalOpen, selectedModalClose} = useModalActions();

  const { data, isLoading, isError, error } = useQuery({queryKey: ['data']});

  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { selectedModalClose(modalName) }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        {/* Title */}
        <div className={styles.modalContent}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              {modalName} 처리
            </div>
          </div>
        </div>
        {/* 정보 */}
        <div className={styles.codeContainer}>
          <table className={styles.table}>
            <thead 
            style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
            >
              <tr>
                <th style={{width:'10%'}}>상품코드</th>
                <th style={{width:'10%'}}>주문번호</th>
                <th style={{width:'10%'}}>상품명</th>
                <th style={{width:'10%'}}>옵션</th>
                <th style={{width:'10%'}}>주문량</th>
                <th style={{width:'10%'}}>공급가</th>
                <th style={{width:'10%', fontWeight: '650'}}>주문가</th>
                <th style={{width:'10%'}}>취소사유</th>
              </tr>
            </thead>
            <tbody>
            {selectList.map((item, key)=> (
              <tr key={key} className={styles.list}>
              <td>{item.value.ProductId}</td>
              <td>
                {item.orderId}
              </td>
              <td>
              <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>
                {data.some((data)=> (data.id === item.value.ProductId))
                  ? data.find((data) => data.id === item.value.ProductId).title
                  : '상품제목없음'
                }
              </h5>
              </td>
              <td>{data.some((data)=> (data.id === item.value.ProductId)).option
                  ? "옵션있음"
                  : '옵션없음'
                }</td>
              <td>{item.value.order_cnt}</td>
              <td>\{item.value.order_productPrice.toLocaleString()}</td>
              <td style={{fontWeight: '750'}}>
                \{item.value.order_payAmount.toLocaleString()}
              </td>
                <td><input type='text' value={item.value.cancelReason} onChange={(e)=>setSelectListValue(item, "cancelReason", e.target.value)}/></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button  className={styles.selectedButton}>{selectList.length}건 일괄처리</button>
        </div>
      </div>
    </div>
  );
}
