import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useNavigate } from 'react-router-dom';

export default function AdminSoldModal(props) {



  const navigate = useNavigate();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        props.setModal(false); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [props.setModal]);


  // 주문자 정보가 들어있는 객체
  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : props.item.order && props.item.order.name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : props.item.order && props.item.order.tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      props.item.delivery &&
      props.item.delivery.address &&
      props.item.delivery.address.address 
      ?
      `${props.item.delivery.address.address.roadAddress} 
      (${props.item.delivery.address.address.bname}, 
        ${props.item.delivery.address.address.buildingName 
      ? props.item.delivery.address.address.buildingName
      : props.item.delivery.address.address.jibunAddress})
      ${props.item.delivery.address.addressDetail}` 
      : '',
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : props.item.delivery &&
      props.item.delivery.deliveryType &&
      props.item.delivery.deliveryType === '화물'

      ? props.item.delivery.deliverySelect === 'kr.daesin' 
      ? `${props.item.delivery && props.item.delivery.deliveryType} (배송 업체 : 대신화물)` 
      : `${props.item.delivery && props.item.delivery.deliveryType} (배송 업체 : 경동화물)`

      : props.item.delivery &&
      props.item.delivery.deliveryType &&
      props.item.delivery.deliveryType === '성동택배'

      ? `${props.item.delivery && props.item.delivery.deliveryType} 
      (배송 예정일 : ${props.item.delivery && props.item.delivery.deliveryDate})`
      : props.item.delivery && props.item.delivery.deliveryType === '일반택배'
      ? `${props.item.delivery.deliveryType} (배송사 : 대한통운)`
      : '없음'
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : props.item.delivery && props.item.delivery.deliveryMessage ? props.item.delivery.deliveryMessage : '없음',
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : props.item.order && props.item.order.smtMessage ? props.item.order.smtMessage : '없음',
    },
    { 
      id : 6, 
      title : '결제 방법', 
      value : props.item.order && props.item.order.payRoute,
    },
    {
      id : 7, 
      title : '증빙 서류 발급', 
      value : props.item.order && props.item.order.moneyReceipt,
    },
    {
      id: 8,
      title : '명세서',
      value : props.item.order
      && props.item.order.moneyReceipt 
      && props.item.order.transAction
      ? props.item.order.transAction === '명세서출력'
      ? `${props.item.order.transAction} (Fax 번호 : ${props.item.order.fax})`
      : props.item.order.transAction
      : '발행안함'
    }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { props.setModal(false) }}>
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
          {orderInputValue.map((item) => 
          <div className={styles.codeInputContainer}>
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
