import React, { useState, useEffect } from 'react';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './ModalStyles.module.css';

export default function InvoiceModal(props) {
    const { selectedModalClose } = useModalActions();
    const [courier, setCourier] = useState('');
    const [newInvoiceNumber, setNewInvoiceNumber] = useState('');
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

    // 송장수정 변경사항 적용
    const applyInvoiceChanges = () => {
        console.log('Applying changes - Courier:', courier, 'New Invoice Number:', newInvoiceNumber);
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
                            <th>처리상태</th>
                            <th>주문일자</th>
                            <th>상품코드</th>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>옵션명</th>
                            <th>표준가</th>
                            <th>공급가</th>
                            <th>택배사</th> {/* 추가: 택배사 컬럼 */}
                            <th>송장번호</th> {/* 추가: 송장번호 컬럼 */}
                        </tr>
                    </thead>
                    <tbody>
                        {fetchedData.length > 0 &&
                            fetchedData.map((item, index) => (
                                <tr key={index}>
                                    {/* 주문번호 */}
                                    <td>{item.orderId}</td>
                                    {/* 배송상태 */}
                                    <td>{props.parseDeliveryState(item.deliveryStatus)}</td>
                                    {/* 주문일자 */}
                                    <td>{item.order_Date}</td>
                                    {/* 상품번호 */}
                                    <td>{item.ProductId}</td>
                                    {/* 미니 이미지 */}
                                    <td>{item.image.mini}</td>
                                    {/* 상품명 */}
                                    <td>{item.title}</td>
                                    {/* 옵션 상세 - 선택 옵션이 있을 경우만 표시*/}
                                    <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                                    {/* 가격 */}
                                    <td>{item.price}</td>
                                    {/* 할인률 */}
                                    <td>{item.discount === 0 ? item.price : item.price - (item.price * item.discount / 100)}</td>
                                    {/* 택배사 선택 */}
                                    <td>
                                        <select
                                            className={styles.handler}
                                            value={item.deliverySelect}
                                            onChange={(e) => setCourier(e.target.value)}
                                        >
                                            <option value="">선택</option>
                                            <option value="성동택배">성동택배</option>
                                            <option value="대한통운">대한통운</option>
                                            <option value="롯데택배">롯데택배</option>
                                        </select>
                                    </td>
                                    {/* 송장번호 입력 */}
                                    <td>
                                        <input
                                            className={styles.handler}
                                            type="text"
                                            value={item.delivery_num}
                                            onChange={(e) => setNewInvoiceNumber(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* 적용 버튼 */}
                <button className={styles.applyButton} onClick={applyInvoiceChanges}>
                    적용
                </button>
            </div>
        </div>
    );
}
