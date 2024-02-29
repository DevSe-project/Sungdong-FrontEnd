import { React, useEffect, useState } from 'react';
import styles from './AdminSoldModal.module.css';
import { useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from '../../../store/DataStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../../customFn/useFetch'

export default function AdminCancelModal() {

  const selectList = useOrderSelectList();
  const {setSelectListValue} = useOrderSelectListActions();

  const { modalName } = useModalState();
  const {selectedModalClose} = useModalActions();

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
  const fetchUpdateData = async (selectList) => {
      return await fetchNonPageServer(selectList, `put`, `/order/cancel`)
    };
    

 //주문 취소 함수
  const { mutate:cancelOrderMutate } = useMutation({mutationFn: fetchUpdateData})


  const handleOrderCanceled = (selectList) => {
    cancelOrderMutate(selectList,{
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('상품이 취소처리 되었습니다.', data);
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
                <th>주문자 성함</th>
                <th>주문자 연락처</th>
                <th style={{width:'10%'}}>취소사유</th>
              </tr>
            </thead>
            <tbody>
            {selectList.map((item, key)=> (
              <tr key={key} className={styles.list}>
                <td>
                  {item.value.order_id}
                </td>
                <td>
                  {
                  item.value.orderState === 0 ? "미결제" :
                  item.value.orderState === 1 ? "신규주문" :
                  item.value.orderState === 2 ? "발송완료" :
                  item.value.orderState === 6 && "취소요청"}
                </td>
                <td>
                <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>
                  {item.value.product_title} {(item.value.product_length-1) > 0 && `외 ${item.value.product_length-1}건`}
                </h5>
                </td>
                <td>
                  {new Date(item.value.order_date).toLocaleString()}
                </td>
                <td style={{fontWeight: '750'}}>
                  \{parseInt(item.value.order_payAmount).toLocaleString()}
                </td>
                <td>
                  {item.value.order_name}
                </td>
                <td>
                  {item.value.order_tel}
                </td>
                <td><input className={styles.miniInput} type='text' value={item.value.cancelReason} onChange={(e)=>setSelectListValue(item, "cancelReason", e.target.value)}/></td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button  className={styles.selectedButton} onClick={()=> selectList.some((item) => item.value.cancelReason) !== "" && handleOrderCanceled(selectList)}>{selectList.length}건 일괄처리</button>
        </div>
      </div>
    </div>
  );
}
