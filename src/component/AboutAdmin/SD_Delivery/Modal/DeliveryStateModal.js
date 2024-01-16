import { useState, useEffect } from "react";
import { useModalActions } from "../../../../Store/DataStore";
import styles from './ModalStyles.module.css';
import parentsStyles from '../InquireTable/Deli_InquireTable.module.css';

// 주문 상태 수정을 위한 모달 컴포넌트
export default function DeliveryStateModal(props) {
    // 모달 닫기 함수
    const { selectedModalClose } = useModalActions();
    // 가져온 데이터 저장 상태
    const [fetchedData, setFetchedData] = useState([]);
    // 선택된 배송 상태 저장 상태
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(0);

    useEffect(() => {
        // ESC 키로 모달 닫기 이벤트 리스너 등록
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
        // 체크된 항목이나 개별 배송 상태 변경시 데이터 다시 가져오기
        dataFetch();
    }, [props.checkedItems, props.matchedData]);

    // [Effect연결함수] 선택된 항목의 데이터 가져오기
    function dataFetch() {
        if (!props.checkedItems) {
            // 체크된 항목 없으면 모달 닫기
            selectedModalClose();
        }

        // 체크된 항목에 해당하는 데이터 가져오기
        const data = props.checkedItems.map(orderId => {
            const matchingData = props.matchedData.find(item => item.orderId === orderId);
            return matchingData;
        });

        setFetchedData(data);
    }

    // 일괄 변경 버튼 클릭 시 호출되는 함수
    function handleBatchStatus() {
        const parseStatus = parseInt(selectedDeliveryStatus, 10);
        if (parseStatus === 1 || parseStatus === 2 || parseStatus === 3) {
            if (props.checkedItems.length === 0) {
                alert("선택된 항목이 없습니다.");
                return;
            }
            // 일괄 업데이트 로직 들어가야 할 곳(선택항목을 매칭데이터와 매치시켜 업데이트)
            const updateData = props.matchedData.map((item) => {
                if (props.checkedItems.includes(item.orderId))
                    return {
                        ...item,
                        // deliveryStatus: selectedStatus
                    };
            })

            props.setMatchedData(updateData);
        } else {
            alert("잘못된 선택입니다.");
            setSelectedDeliveryStatus(0); // 선택된 상태 초기화
        }
    }

    // 개별 항목의 배송 상태 변경 함수
    const handlePerStatus = (orderId, e) => {
        const selectedStatus = parseInt(e.target.value, 10);

        // 선택된 항목들에 대해 새로운 배송 상태 설정
        const updatedData = props.matchedData.map(item => {
            if (props.checkedItems.includes(item.orderId)) {
                if (item.orderId === orderId) {
                    // 현재 처리 중인 항목에 대해서만 상태 업데이트
                    return {
                        ...item,
                        deliveryStatus: selectedStatus
                    };
                }
            }
            return item;
        });

        // 변경된 데이터로 전체 상태 업데이트
        props.setMatchedData(updatedData);
    };



    // // 개별 항목 선택 및 해제 함수
    // const toggleSelectedStatus = (orderId) => {
    //     if (props.checkedItems.includes(orderId)) {
    //         // 이미 선택된 항목이면 선택 해제
    //         const updatedCheckedItems = props.checkedItems.filter(id => id !== orderId);
    //         props.setCheckedItems(updatedCheckedItems);
    //     } else {
    //         // 선택되지 않은 항목이면 선택
    //         props.setCheckedItems([...props.checkedItems, orderId]);
    //     }
    // };

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

                {/* 데이터 표시 테이블 */}
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

                    {/* 데이터 표시 */}
                    <tbody>
                        {fetchedData.map((item, index) => (
                            <tr key={index}>
                                {/* 주문번호 */}
                                <td>{item.orderId}</td>
                                {/* 배송상태 */}
                                <td>
                                    <select
                                        className={parentsStyles.handler}
                                        value={item.deliveryStatus}
                                        onChange={(e) => {
                                            handlePerStatus(item.orderId, e);
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

                {/* 일괄 변경 버튼 */}
                <button className={styles.batchChangeButton} onClick={handleBatchStatus}>
                    일괄 변경
                </button>

            </div>
        </div >
    );
}
