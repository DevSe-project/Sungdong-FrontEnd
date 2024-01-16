import { useState, useEffect } from "react";
import { useModalActions } from "../../../../Store/DataStore";
import styles from './ModalStyles.module.css';
import parentsStyles from '../InquireTable/Deli_InquireTable.module.css';

//전제조건 : 선택 항목의 개수가 currentPage 수를 넘지 않는다는 것 -> 때문에 따로 최대 개수 설정 불필요
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


    // 선택된 항목의 배송상태를 일괄 변경
    function batchChange_deliveryStatus() {
        const parseStatus = parseInt(selectedDeliveryStatus, 10);

        // 1, 2, 3 중에 값이 있어야 함수 동작
        if (parseStatus === 1 || parseStatus === 2 || parseStatus === 3) {
            const confirmed = window.confirm("변경하시겠습니까?");

            if (confirmed) {
                // 선택된 항목들이 없는 경우에는 알림창을 띄우고 함수 종료
                if (props.checkedItems.length === 0) {
                    alert("선택된 항목이 없습니다.");
                    return;
                }

                // 선택된 항목들에 대해 새로운 배송 상태 설정
                const updatedData = props.matchedData.map(item => {
                    if (props.checkedItems.includes(item.orderId)) {
                        return {
                            ...item,
                            deliveryStatus: parseStatus
                        };
                    }
                    return item;
                });

                // 일괄 변경된 데이터로 상태 업데이트
                props.setMatchedData(updatedData);
                setSelectedDeliveryStatus(0);
                selectedModalClose();
                return; // 중요: 함수를 여기서 종료합니다.
            }

            // '취소'를 선택한 경우
            setSelectedDeliveryStatus(0); // 초기화
            alert("수정이 취소되었습니다.");
        } else {
            // 잘못된 선택일 경우
            alert("잘못된 선택입니다.");
            setSelectedDeliveryStatus(0);
        }
    }





    // 배송 상태 개별 업데이트
    const handleIndividualChangeDeliveryStatus = (orderId, e) => {
        const selectedStatus = parseInt(e.target.value, 10);

        // 선택된 항목들에 대해 새로운 배송 상태 설정
        const updatedData = props.matchedData.map(item => {
            if (item.orderId === orderId) {
                return {
                    ...item,
                    deliveryStatus: selectedStatus
                };
            }
            return item;
        });

        // 일괄 변경된 데이터로 상태 업데이트
        props.setMatchedData(updatedData);
    };




    return (
        <div className='modalOverlay'>
            <div className='modalContainer'
                style={{
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
                            <th>
                                처리상태
                                <select
                                    className={parentsStyles.handler}
                                    value={selectedDeliveryStatus}
                                    onChange={(e) => {
                                        setSelectedDeliveryStatus(e.target.value);
                                    }}
                                >
                                    <option value={0}>선택</option>
                                    <option value={1}>배송 준비</option>
                                    <option value={2}>배송 중</option>
                                    <option value={3}>배송 완료</option>
                                </select>
                            </th>
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
                                                handleIndividualChangeDeliveryStatus(item.orderId, e);
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

                <button className={styles.batchChangeButton} onClick={batchChange_deliveryStatus}>
                    일괄 변경
                </button>

            </div>
        </div >
    );
}
