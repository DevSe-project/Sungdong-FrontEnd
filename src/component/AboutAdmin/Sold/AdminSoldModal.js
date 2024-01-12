import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState } from '../../../Store/DataStore';


export default function AdminSoldModal({item}) {

  const navigate = useNavigate();

  const { modalName } = useModalState();
  const {selectedModalOpen, selectedModalClose} = useModalActions();

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
      title : '성함', 
      value : item.ordered_receiver && item.ordered_receiver,
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
      title : '배송방식', 
      value : item.delivery &&
      item.delivery.deliveryType &&
      item.delivery.deliveryType === '화물'

      ? item.delivery.deliverySelect === 'kr.daesin' 
      ? `${item.delivery && item.delivery.deliveryType} (배송 업체 : 대신화물)` 
      : `${item.delivery && item.delivery.deliveryType} (배송 업체 : 경동화물)`

      : item.delivery &&
      item.delivery.deliveryType &&
      item.delivery.deliveryType === '성동택배'

      ? `${item.delivery && item.delivery.deliveryType} 
      (배송 예정일 : ${item.delivery && item.delivery.deliveryDate})`
      : item.delivery && item.delivery.deliveryType === '일반택배'
      ? `${item.delivery.deliveryType} (배송사 : 대한통운)`
      : '없음'
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : item.delivery && item.delivery.deliveryMessage ? item.delivery.deliveryMessage : '없음',
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : item.order && item.order.smtMessage ? item.order.smtMessage : '없음',
    },
    { 
      id : 6, 
      title : '결제 방법', 
      value : item.order && item.order.payRoute,
    },
    {
      id : 7, 
      title : '증빙 서류 발급', 
      value : item.order && item.order.moneyReceipt,
    },
    {
      id: 8,
      title : '명세서',
      value : item.order
      && item.order.moneyReceipt 
      && item.order.transAction
      ? item.order.transAction === '명세서출력'
      ? `${item.order.transAction} (Fax 번호 : ${item.order.fax})`
      : item.order.transAction
      : '발행안함'
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
              주문자 정보
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
