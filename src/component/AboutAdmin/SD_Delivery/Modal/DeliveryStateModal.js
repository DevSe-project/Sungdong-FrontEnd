import { useState, useEffect } from "react";
import { useModalActions } from "../../../../Store/DataStore";
import styles from './ModalStyles.module.css';
import parentsStyles from '../InquireTable/Deli_InquireTable.module.css';

export default function DeliveryStateModal(props) {
    const { selectedModalClose } = useModalActions();
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(0);



    useEffect(() => {
        const orders = props.checkedItems.map(orderId => {
            const order = props.matchedData.find(item => item.orderId === orderId);
            return order;
        });
        setSelectedOrders(orders);
    }, [props.checkedItems]);



    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const exit_esc = (event) => {
            if (event.key === 'Escape') {
                selectedModalClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출;
            }
        };

        window.addEventListener('keydown', exit_esc);

        return () => {
            window.removeEventListener('keydown', exit_esc);
        };
    }, [selectedModalClose]);



    const handleBatchChangeDeliveryStatus = () => {
        if (window.confirm("배송 상태를 변경하시겠습니까?")) {
            const updatedData = props.matchedData.map(item => {
                if (props.checkedItems.includes(item.orderId)) {
                    return {
                        ...item,
                        deliveryStatus: selectedDeliveryStatus
                    };
                }
                return item;
            });

            props.setMatchedData(updatedData);
            props.setCheckedItems([]); // Clear selection
            setSelectedDeliveryStatus(0); // Reset delivery status
            selectedModalClose(); // Close modal
        }
    };



    // Delivery status update function for individual change
    const handleIndividualChangeDeliveryStatus = (orderId) => {
        const updatedData = props.matchedData.map(item => {
            if (item.orderId === orderId) {
                return {
                    ...item,
                    deliveryStatus: selectedDeliveryStatus
                };
            }
            return item;
        });

        props.setMatchedData(updatedData);
    };



    return (
        <div className='modalOverlay'>
            <div className='modalContainer'
                style={ {
                    width: 'max-content',
                    }}>
                <div
                    className='exitButton'>
                    <span onClick={() => {
                        selectedModalClose();
                    }}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>


                {/* 제목 */}
                <div className={styles.modalTitle}>
                    배송 상태 수정
                </div>


                <table className={styles.deliveryTable}>
                    {/* Column Names */}
                    <thead
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                        }}
                    >
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
                        </tr>
                    </thead>

                    {/* onDisplay */}
                    <tbody>
                        {props.matchedData &&
                            selectedOrders.map((item, index) => (
                                <tr key={index}>
                                    {/* 주문번호 */}
                                    <td>{item.orderId}</td>
                                    {/* 배송상태 */}
                                    <td>
                                        <select
                                            className={parentsStyles.handler}
                                            value={item.deliveryStatus}
                                            onChange={(e) => {
                                                directUpdate_deliveryStatus(e, item.deliveryStatus);
                                                console.log(item.deliveryStatus);
                                            }}
                                        >
                                            <option value={1}>배송 준비</option>
                                            <option value={2}>배송 중</option>
                                            <option value={3}>배송 완료</option>
                                        </select>
                                    </td>
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
                                </tr>
                            ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}
