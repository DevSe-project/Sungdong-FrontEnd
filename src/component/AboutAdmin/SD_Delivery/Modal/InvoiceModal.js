import React, { useState, useEffect } from 'react';
import { useModalActions } from '../../../../Store/DataStore';
import styles from './ModalStyles.module.css';

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
        const data = props.checkedItems.map(orderId => {
            return props.matchedData.find(item => item.orderId === orderId);
        });

        setFetchedData(data);
    }

    // 택배사 변경 핸들러
    function updateDeliveryCompany(val, orderId) {
        const updatedData = fetchedData.map(item => {
            if (item.orderId === orderId) {
                return {
                    ...item,
                    deliverySelect: val
                };
            }
            return item;
        })

        setFetchedData(updatedData);
    }

    // 송장번호 변경 핸들러
    function updateInvoiceNumber(val, orderId) {
        const updatedData = fetchedData.map(item => {
            if (item.orderId === orderId) {
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
                deliverySelect: fetchedData.find((fetchedItem) => (fetchedItem.orderId === data.orderId)).deliverySelect,
                delivery_num: fetchedData.find((fetchedItem) => (fetchedItem.orderId === data.orderId)).delivery_num
            }))
        )

        selectedModalClose();
    };


    return (
        <div className='modalOverlay'>
            <div className='modalContainer'>
                <div className='exitButton' onClick={() => selectedModalClose()}>
                    <i className="fas fa-times"></i>
                </div>

                <div className={styles.modalTitle}>송장 수정</div>

                <table className={styles.deliveryTable}>
                    <thead>
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
                                    <td>{item.orderId}</td>
                                    <td>
                                        <select
                                            className={styles.handler}
                                            value={item.deliverySelect}
                                            onChange={(e) => updateDeliveryCompany(e.target.value, item.orderId)}
                                        >
                                            <option value="성동택배">성동택배</option>
                                            <option value="대한통운">대한통운</option>
                                            <option value="롯데택배">롯데택배</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            className={styles.handler}
                                            type="text"
                                            value={item.delivery_num}
                                            onChange={(e) => updateInvoiceNumber(e.target.value, item.orderId)}
                                        />
                                    </td>
                                    <td>{props.parseDeliveryState(item.deliveryStatus)}</td>
                                    <td>{item.order_Date}</td>
                                    <td>{item.ProductId}</td>
                                    <td>{item.image.mini}</td>
                                    <td>{item.title}</td>
                                    <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                                    <td>{item.price}</td>
                                    <td>{item.discount === 0 ? item.price : item.price - (item.price * item.discount / 100)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                <button className={styles.applyButton} onClick={applyInvoiceChanges}>
                    적용
                </button>
            </div>
        </div>
    );
}
