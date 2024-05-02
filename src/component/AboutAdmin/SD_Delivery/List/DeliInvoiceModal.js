import React, { useState, useEffect } from 'react';
import { useModalActions } from '../../../../store/DataStore';
import styles from './DeliModal.module.css';
import { GetCookie } from '../../../../customFn/GetCookie';
import axios from '../../../../axios';

export default function DeliInvoiceModal(props) {
  const { selectedModalClose } = useModalActions();
  const [fetchedData, setFetchedData] = useState([]);

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

  useEffect(() => {
    // 업데이트 함수
    dataFetch();
  }, []);

  // 데이터 Fetching
  function dataFetch() {
    if (!props.checkedItems) {
      selectedModalClose();
    }

    // 체크된 항목에 해당하는 데이터 가져오기
    const data = props.checkedItems.map(order_id => {
      return props.deliveryData.find(item => item.order_id === order_id);
    });

    setFetchedData(data);
  }

  // 택배사 변경 핸들러
  function updateDeliveryCompany(val, order_id) {
    const updatedData = fetchedData.map(item => {
      if (item.order_id === order_id) {
        return {
          ...item,
          delivery_selectedCor: val
        };
      }
      return item;
    })

    setFetchedData(updatedData);
  }

  // 송장번호 변경 핸들러
  function updateInvoiceNumber(val, order_id) {
    const updatedData = fetchedData.map(item => {
      if (item.order_id === order_id) {
        return {
          ...item,
          delivery_num: val
        };
      }
      return item;
    });

    setFetchedData(updatedData);
  };

  // 변경사항 적용
  const sendUpdateInvoiceApiToServer = async () => {
    try {
      const token = GetCookie('jwt_token');

      const updatedData = fetchedData.map(item => ({
        order_id: item.order_id,//식별자
        delivery_selectedCor: item.delivery_selectedCor,
        delivery_num: item.delivery_num
      }))

      const response = await axios.put(
        `/delivery/invoice/edit`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorizaition": `Bearer ${token}`
          }
        }
      )
      if (window.confirm(`적용이 완료되었습니다. 창을 닫으시겠습니까?`) && response.status === 200) {
        selectedModalClose();
        alert(`변경사항이 성공적으로 업데이트되었습니다.`);
        window.location.reload();
      } else {
        alert("변경사항 업데이트에 실패했습니다.");
      }

      return response.data;

    } catch (error) {
      throw new Error('송장을 수정하는 중 오류가 발생했습니다.')
    }
  };


  return (
    <div className='modalOverlay'>
      <div className='modalContainer'>
        <div className='exitButton'>
          <span onClick={() => { selectedModalClose(); }}>
            <i className="fas fa-times"></i>
          </span>
        </div>

        {/* 제목 */}
        <div className={styles.modalTitle}>송장 수정</div>

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
                <th>택배사</th>
                <th>송장번호</th>
                <th>처리상태</th>
                <th>주문일자</th>
                <th>상품코드</th>
                <th style={{ width: '200px', overflowX: 'hidden' }}>상품명</th>
                <th>옵션명</th>
                <th>표준가</th>
                <th>공급가</th>
              </tr>
            </thead>
            <tbody>
              {fetchedData.length > 0 &&
                fetchedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.order_id}</td>
                    <td>
                      <select
                        className='select'
                        value={item.delivery_selectedCor}
                        onChange={(e) => updateDeliveryCompany(e.target.value, item.order_id)}
                      >
                        <option value="">선택</option>
                        <option value="성동택배">성동택배</option>
                        <option value="대한통운">대한통운</option>
                        <option value="롯데택배">롯데택배</option>
                        <option value="kr.daesin">대신화물</option>
                        <option value="kr.kdexp">경동화물</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className='select'
                        type="text"
                        value={item.delivery_num}
                        onChange={(e) => updateInvoiceNumber(e.target.value, item.order_id)}
                      />
                    </td>
                    <td>{props.parseDeliveryState(item.orderState)}</td>
                    {/* 주문일자 */}
                    <td>{item.order_date}</td>
                    {/* 상품코드 */}
                    <td>{item.product_id}</td>
                    {/* 상품명 */}
                    <td style={{ width: '200px', overflowX: 'hidden' }}>{item.product_title}</td>
                    {/* 옵션 */}
                    <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                    {/* 표준가 */}
                    <td>{item.product_price}</td>
                    {/* 공급가 */}
                    <td>{item.discountPrice}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* 적용 버튼 */}
        <div style={{ margin: '10px' }}>
          <button className='original_button' onClick={sendUpdateInvoiceApiToServer}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
