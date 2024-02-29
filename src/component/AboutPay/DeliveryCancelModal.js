import { React, useEffect } from 'react';
import styles from './DeliveryCancelModal.module.css';
import { useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from '../../store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';

export default function DeliveryCancelModal() {

  const { modalName, modalItem } = useModalState();
  const {selectedModalClose, setModalItem} = useModalActions();

  const queryClient = useQueryClient();

  const { fetchNonPageServer } = useFetch();

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

  //fetch 함수
  const fetchUpdateData = async (item) => {
      return await fetchNonPageServer(item, `put`, `/order/user/cancel`)
    };
    

 //주문 취소 함수
  const { mutate:cancelOrderMutate } = useMutation({mutationFn: fetchUpdateData})


  const handleOrderCanceled = (item) => {
    cancelOrderMutate(item,{
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('상품을 취소요청 하였습니다.', data);
      // 상태를 다시 불러와 갱신합니다.
      queryClient.invalidateQueries(['order']);
      selectedModalClose(modalName);
    },
    onError: (error) => {
      // 실패 시, 에러 처리를 수행합니다.
      console.error('주문 상태를 변경하던 중 오류가 발생했습니다.', error);
    },
  })
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
                <th>주문번호</th>
                <th>주문상태</th>
                <th>주문상품</th>
                <th>주문일자</th>
                <th>주문가</th>
                <th style={{width:'10%'}}>취소사유</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.list}>
                <td>
                  {modalItem.order_id}
                </td>
                <td>
                  {
                  modalItem.orderState === 0 ? "미결제" :
                  modalItem.orderState === 1 ? "결제완료" :
                  modalItem.orderState === 2 && "배송 준비중" }
                </td>
                <td>
                <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>
                  {JSON.parse('[' + modalItem.products + ']')[0].product_title} {(JSON.parse('[' + modalItem.products + ']').length-1) > 0 && `외 ${JSON.parse('[' + modalItem.products + ']').length-1}건`}
                </h5>
                </td>
                <td>
                  {new Date(modalItem.order_date).toLocaleString()}
                </td>
                <td style={{fontWeight: '750'}}>
                  \{parseInt(modalItem.order_payAmount).toLocaleString()}
                </td>
                <td><input className={styles.input} type='text' value={modalItem.cancelReason} onChange={(e)=> setModalItem("cancelReason", e.target.value)}/></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>닫기</button>
          <button  className={styles.selectedButton} onClick={()=> modalItem.cancelReason !== "" && handleOrderCanceled(modalItem)}>취소 요청</button>
        </div>
      </div>
    </div>
  );
}
