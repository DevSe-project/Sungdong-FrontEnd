import { React, useEffect, useState } from 'react';
import styles from './AdminModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState } from '../../../Store/DataStore';


export default function AdminRefundModal({item}) {

  const navigate = useNavigate();

  const { modalName } = useModalState();
  const { selectedModalClose} = useModalActions();

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


  // 주문자 정보가 들어있는 객체
  const orderInputValue = [
    { 
      id : 0, 
      title : '전표번호', 
      value : item.rae_id && item.rae_id,
    },
    { 
      id : 0, 
      title : '작성자 성함', 
      value : item.rae_writer && item.rae_writer,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : item.order_phone && item.order_phone,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      `${item.roadAddress} 
      (${item.bname}, 
        ${item.buildingName 
      ? item.buildingName
      : item.jibunAddress})
      ${item.addressDetail}` 
    },
    { 
      id : 3, 
      title : '구매 시 배송방식', 
      value : item.deliveryType &&
      item.deliveryType === '화물'

      ? item.deliverySelect === '대신화물' 
      ? `${item.deliveryType && item.deliveryType} (배송 업체 : 대신화물)` 
      : `${item.deliveryType && item.deliveryType} (배송 업체 : 경동화물)`

      : item.deliveryType &&
      item.deliveryType === '성동택배'

      ? `${item.deliveryType && item.deliveryType} 
      (배송 예정일 : ${item.delivery_date && item.delivery_date})`
      : item.deliveryType && item.deliveryType === '일반택배'
      ? `${item.deliveryType} (배송사 : 대한통운)`
      : '없음'
    },
    { 
      id : 4, 
      title : '결제 방법', 
      value : item.payRoute && item.payRoute,
    },
    {
      id : 5, 
      title : '구매일', 
      value : item.order_Date && item.order_Date,
    },
    {
      id : 6, 
      title : '희망 배송방식', 
      value : item.rae_delivery && item.rae_delivery,
    },
    {
      id: 7,
      title : '제품 상태',
      value : `포장상태 : ${item.rae_wrap} 
      / 상품상태 : ${item.rae_product} /
      바코드상태 : ${item.rae_barcode}`  
    },
    {
      id: 8,
      title : '반환 사유',
      value : item.rae_reason 
      ? item.rae_reason
      : '없음'
    }
  ];

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
              반환증 정보
            </div>
          </div>
        </div>
        {/* 주문자 정보 */}
        <div className={styles.codeContainer}>
          {orderInputValue.map((item, key) => 
          <div key={key} className={styles.codeInputContainer}>
            <div className={styles.label}>
              {item.title}
            </div>
            <div className={styles.input}>
              {item.value}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
