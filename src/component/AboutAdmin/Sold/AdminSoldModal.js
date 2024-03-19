import { React, useEffect } from 'react';
import styles from './AdminSoldModal.module.css';
import { useModalActions, useModalState } from '../../../store/DataStore';


export default function AdminSoldModal({item}) {

  const { modalName } = useModalState();
  const {selectedModalClose} = useModalActions();

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
      id : -1, 
      title : '기업명', 
      value : item.corName && item.corName,
    },
    { 
      id : 0, 
      title : '성함', 
      value : item.order_name && item.order_name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : item.order_tel && item.order_tel,
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
      value : item.deliveryType &&
      item.deliveryType === '화물'

      ? item.deliverySelect === 'kr.kdexp' 
      ? `${item.deliveryType && item.deliveryType} (배송 업체 : 경동화물)`
      : `${item.deliveryType && item.deliveryType} (배송 업체 : 대신화물)` 

      : item.deliveryType &&
      item.deliveryType === '성동택배'

      ? `${item.deliveryType && item.deliveryType} 
      (배송 예정일 : ${item.delivery_date && new Date(item.delivery_date).toLocaleDateString()})`
      : item.deliveryType && item.deliveryType === '일반택배'
      ? `${item.deliveryType} (배송사 : 대한통운)`
      : '없음'
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : item.delivery_message ? item.delivery_message : '없음',
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : item.smtMessage ? item.smtMessage : '없음',
    },
    { 
      id : 6, 
      title : '결제 방법', 
      value : item.order_payRoute && item.order_payRoute,
    },
    {
      id : 7, 
      title : '증빙 서류 발급', 
      value : item.order_moneyReceipt && item.order_moneyReceipt,
    },
    {
      id: 8,
      title : '명세서',
      value : item.order_moneyReceipt 
      && item.printFax
      && item.printFax === 1
      ? `출력 (FAX 번호 : ${item.order_faxNum})`
      : '발행안함'
    }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer} style={{width: '50em'}}>
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
