import React, { useState, useEffect } from 'react';
import { useModalActions } from '../../../../Store/DataStore';
import styles from './DeliveryModalStyles.module.css';

export default function InvoiceModal(props) {
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
    function applyInvoiceChanges() {
        props.setMatchedData((prevData) =>
            prevData.map((data) => ({
                ...data,
                delivery_selectedCor: fetchedData.find((fetchedItem) => (fetchedItem.order_id === data.order_id)).delivery_selectedCor,
                delivery_num: fetchedData.find((fetchedItem) => (fetchedItem.order_id === data.order_id)).delivery_num
            }))
        )

        selectedModalClose();
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
                                <th>이미지</th>
                                <th>상품명</th>
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
                                                <option value="성동택배">성동택배</option>
                                                <option value="대한통운">대한통운</option>
                                                <option value="롯데택배">롯데택배</option>
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
                                        <td>{props.parseDeliveryState(item.delivery_state)}</td>
                                        <td>{item.order_date}</td>
                                        <td>{item.product_id}</td>
                                        <td>{item.product_image_mini}</td>
                                        <td>{item.product_title}</td>
                                        <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                                        <td>{item.product_price}</td>
                                        <td>{item.product_discount === 0 ? item.price : item.price - (item.price * item.discount / 100)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* 적용 버튼 */}
                <div style={{ margin: '10px' }}>
                    <button className='original_button' onClick={applyInvoiceChanges}>
                        적용
                    </button>
                </div>
            </div>
        </div>
    );
}
