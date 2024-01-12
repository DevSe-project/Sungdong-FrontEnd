import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState, useOrderSelectList } from '../../../Store/DataStore';

export default function AdminCancelModal() {

  const selectList = useOrderSelectList();

  const { modalName } = useModalState();
  const {selectedModalOpen, selectedModalClose} = useModalActions();


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
                <td>{item.productId}</td>
                <td>
                  {item.orderId}
                </td>
                <td>
                  <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.productName}</h5>
                </td>
                <td>{item.optionSelected}</td>
                <td>{item.cnt}</td>
                <td>\{item.price.toLocaleString()}</td>
                <td style={{fontWeight: '750'}}>
                  {item.finprice
                  ? item.discount
                  ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                  : `\\${item.finprice.toLocaleString()}`
                  : `\\${item.price.toLocaleString()}`}
                </td>
                <td><input type='text'/></td>
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
