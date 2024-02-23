import { React, useEffect, useState } from 'react';
import styles from './AdminModal.module.css';
import { useModalActions, useModalState, useOrderSelectListActions } from '../../../store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../../customFn/useFetch';

export default function AdminRefundDialog({selectList}) {

  const { modalName } = useModalState();
  const {selectedModalClose} = useModalActions();

  const queryClient = useQueryClient();
  const {fetchNonPageServer} = useFetch();
  const [selectedData, setSelectedData] = useState([]);

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
  }, [selectedModalClose], [modalName]);


  useEffect(() => {
    if(selectList){
      handleOpenItem(selectList)
    }
  }, [])


  // ---------------- 아이템 Fetch Mutation -----------------

  const mutationfetch = async (orderId) => {
    const data = await fetchNonPageServer(orderId, `post`, `/rae/admin/find/products`)
    return data;
  }

  const { mutate: matchedItemMutation } = useMutation({ mutationFn: mutationfetch })

  function handleOpenItem(raeId) {
    matchedItemMutation(raeId, {
      onSuccess: (success) => {
        setSelectedData(success.data);
      },
      onError: (error) => {
        return console.error(error.message);
      }
    })
  }


    //fetch 함수
    const fetchUpdateData = async (data) => {
      try {
        const token = GetCookie('jwt_token');
        const completeItemsData = data.map((item) => ({
          rae_id: item.rae_id,
          raeState: 4,
        }))
        const cancelItemsData = data.map((item) => ({
          rae_id: item.rae_id,
          raeState: 5,
          rae_cancelReason: item.rae_cancelReason
        }))
        if(modalName === "완료"){
        const response = await axios.patch("/rae/admin/expedite", 
          JSON.stringify(
            completeItemsData
          ),
          {
            headers : {
              "Content-Type" : "application/json",
              'Authorization': `Bearer ${token}`
            }
          }
        )
        return response.data;
      } else if(modalName === "철회"){
        const response = await axios.patch("/rae/admin/cancel", 
        JSON.stringify(
          cancelItemsData
        ),
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      )
      return response.data;
      }
        // 성공 시 추가된 상품 정보를 반환합니다.
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
      }
    };
    

  //처리 함수
  const { mutate:refundMutate } = useMutation({mutationFn: fetchUpdateData})

  function handleChangeStatus(datas) {
    refundMutate(datas,{
      onSuccess: (data) => {
        // 메세지 표시
        alert(data.message);
        console.log('처리 되었습니다.', data);
        // 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['raeAdmin']);
      },
      onError: (error) => {
        // 실패 시, 에러 처리를 수행합니다.
        console.error('상태를 변경하던 중 오류가 발생했습니다.', error);
      }
    }
  )}

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
              일괄 {modalName}하시겠습니까?
            </div>
          </div>
        </div>
        {/* 주문자 정보 */}
        <div className={styles.codeContainer}>
          {/* 리스트 출력 */}
          <table className={styles.table}>
            <thead 
            style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
            >
            {/* 헤드 */}
            <tr>
              <th style={{width:'10%'}}>전표번호</th>
              <th>전표 내부번호</th>
              <th style={{width:'10%'}}>구분</th>
              <th style={{width:'10%'}}>처리상태</th>
              <th style={{width:'10%'}}>상품명</th>
              <th>반환수단</th>
              <th style={{width:'10%'}}>반환수량</th>
              <th style={{width:'10%', fontWeight: '650'}}>반환금액</th>
              <th>신청인</th>
              {modalName === "철회" && <th style={{width:'10%', fontWeight: '650'}}>철회사유</th>}
            </tr>
            </thead>
            <tbody>
              {selectedData.length > 0 && selectedData.map((item, key)=> (
              <tr key={key} className={styles.list}>
                <td>{item.rae_id}</td>
                <td>{item.rae_product_id}</td>
                <td>
                  {item.rae_type === 0 ? "반품" :
                  item.rae_type === 1 ? "교환" :
                  item.rae_type === 2 && "취소"}
                </td>
                <td>
                  {item.raeState === 1 ? "반품요청" :
                  item.raeState === 2 ? "수거중" :
                  item.raeState === 3 ? "수거완료" :
                  item.raeState === 4 ? "반품완료" :
                  item.raeState === 5 && "반품철회"}
                </td>
                <td>
                <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>
                  {item.product_title}
                </h5>
                </td>
                <td>
                  {item.rae_returnDel}
                </td>
                <td>{item.rae_product_cnt}</td>
                <td style={{fontWeight: '750'}}>
                  \{parseInt(item.rae_product_amount).toLocaleString()}
                </td>
                <td>
                  {item.rae_writter}
                </td>
                {modalName === "철회" 
                && 
                <td>
                  <input type='text' value={item.rae_cancelReason} onChange={(e)=> 
                  {
                    const updatedData = selectedData.map(selectedItem => {
                      if (selectedItem === item) {
                          return {...selectedItem, rae_cancelReason: e.target.value};
                      }
                      return selectedItem;
                  });
                  setSelectedData(updatedData);
                  }
                  }/>
                </td>
                }
              </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button  className={styles.selectedButton} onClick={()=>{
            handleChangeStatus(selectedData);
          }}>{selectedData.length}건 일괄처리</button>
        </div>
      </div>
    </div>
  );
}
