import { useState, useEffect } from "react";
import { useModalActions } from "../../../../store/DataStore";
import styles from './DeliModal.module.css';
import axios from '../../../../axios';
import { GetCookie } from "../../../../customFn/GetCookie";
import { useFetch } from "../../../../customFn/useFetch";

// 배송 상태 수정 모달 컴포넌트
export default function DeliStateModal(props) {
  // 모달 닫기 함수 가져오기
  const { selectedModalClose } = useModalActions();
  // 가져온 데이터 저장 상태
  const [fetchedData, setFetchedData] = useState([]);


  // ESC 키로 모달 닫기 이벤트 리스너 등록
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose();
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);

  // 선택된 항목이나 개별 배송 상태 변경 시 useEffect를 통해 데이터 다시 가져오기
  useEffect(() => {
    dataFetch();
  }, [props.checkedItems, props.setCheckedItems]);

  // 선택된 항목의 데이터 가져오는 함수
  function dataFetch() {
    if (!props.checkedItems) {
      selectedModalClose();
    }
    // 체크된 항목에 해당하는 데이터 가져오기
    const data = props.checkedItems.map(order_id => {
      const matchingData = props.deliveryData.find(item => item.order_id === order_id);
      return matchingData;
    });

    setFetchedData(data);
  }

  // 모든 항목의 배송 상태 변경 함수
  function handleBatchStatus(val) {
    // FetchedData의 모든 항목의 배송 상태 일괄 업데이트
    setFetchedData((prevData) =>
      prevData.map((item) => ({
        ...item,
        orderState: val,
      }))
    );
  }

  // 개별 항목의 배송 상태 변경 함수
  function handlePerStatus(order_id, e) {
    const selectedStatus = parseInt(e.target.value, 10);

    if (selectedStatus === 1 || selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4) {
      // 선택된 항목의 배송 상태 업데이트
      const updatedData = fetchedData.map(item => {
        if (item.order_id === order_id) {
          return {
            ...item,
            orderState: selectedStatus
          };
        }
        return item;
      });

      setFetchedData(updatedData);
    } else {
      alert("잘못된 선택입니다.");
    }
  }



  // 배송 상태 변경 함수
  const sendUpdateStateApiToServer = async () => {
    try {
      const token = GetCookie('jwt_token');

      // 변경된 배송 상태 데이터 추출
      const updatedData = fetchedData.map(item => ({
        order_id: item.order_id,//식별자
        orderState: item.orderState
      }));

      const response = await axios.put(
        `/delivery/state/edit`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (window.confirm(`적용이 완료되었습니다. 창을 닫으시겠습니까?`) && response.status === 200) {
        selectedModalClose();
        alert(`변경사항이 성공적으로 업데이트되었습니다.`);
        window.location.reload();
      } else {
        alert("변경사항 업데이트에 실패했습니다.");
      }

    } catch (error) {
      console.error("배송 상태 업데이트 중 오류가 발생했습니다:", error);
    }
  }




  return (
    <div className='modalOverlay'>
      <div className='modalContainer'>
        <div className='exitButton'>
          <span onClick={() => { selectedModalClose(); }}>
            <i className="fas fa-times"></i>
          </span>
        </div>

        {/* 제목 */}
        <div className={styles.modalTitle}>배송 상태 수정</div>

        <div style={{ margin: '10px' }}>
          {/* 데이터 표시 테이블 */}
          <table>
            {/* Column Names */}
            <thead
              style={{
                backgroundColor: 'white',
                color: 'black',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}>
              <tr>
                <th>주문번호</th>
                <th>상호명</th>
                <th>택배사</th>
                <th>송장 번호</th>
                <th>처리상태</th>
                <th>주문일자</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>옵션명</th>
                <th>표준가</th>
                <th>공급가</th>
              </tr>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  <select
                    className='select'
                    value={
                      fetchedData.length > 0 && fetchedData.every(item => item?.orderState === fetchedData[0]?.orderState)
                        ? fetchedData[0].orderState
                        : 0
                    }
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value, 10);
                      handleBatchStatus(selectedValue);
                    }}
                  >
                    <option value={-1}>개별 선택</option>
                    <option value={2}>배송 준비</option>
                    <option value={3}>배송 중</option>
                    <option value={4}>배송 완료</option>
                  </select>
                </th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {/* 데이터 표시 */}
            <tbody>
              {fetchedData.map((item, index) => (
                <tr key={index}>
                  {/* 주문번호 */}
                  <td>{item.order_id}</td>
                  {/* 상호명 */}
                  <td>{item.cor_corName}</td>
                  {/* 택배사 */}
                  <td>{item.delivery_selectedCor}</td>
                  {/* 송장 번호 */}
                  <td>{item.delivery_num}</td>
                  {/* 배송상태 */}
                  <td>
                    <select
                      className='select'
                      value={item.orderState}
                      onChange={(e) => {
                        handlePerStatus(item.order_id, e);
                      }}
                    >
                      <option value={2}>배송 준비</option>
                      <option value={3}>배송 중</option>
                      <option value={4}>배송 완료</option>
                    </select>
                  </td>
                  {/* 주문일자 */}
                  <td>{item.order_date}</td>
                  {/* 상품번호 */}
                  <td>{item.product_id}</td>
                  {/* 상품명 */}
                  <td>{item.product_title}</td>
                  {/* 옵션 상세 - 선택 옵션이 있을 경우만 표시*/}
                  <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                  {/* 가격 */}
                  <td>{item.product_price}</td>
                  {/* 할인률 */}
                  <td>{item.discountPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 적용 버튼 */}
        <div style={{ margin: '10px' }}>
          <button className='original_button' onClick={sendUpdateStateApiToServer}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
