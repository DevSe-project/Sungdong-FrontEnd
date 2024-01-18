import { useState, useEffect } from "react";
import { useModalActions } from "../../../../Store/DataStore";
import styles from './ModalStyles.module.css';
import parentsStyles from '../InquireTable/Deli_InquireTable.module.css';

// 배송 상태 수정 모달 컴포넌트
export default function DeliveryStateModal(props) {
    // 모달 닫기 함수 가져오기
    const { selectedModalClose } = useModalActions();
    // 가져온 데이터 저장 상태
    const [fetchedData, setFetchedData] = useState([]);
    // 선택된 배송 상태 저장 상태
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(0);
    // 전체 선택된 상태 저장 상태
    const [overallSelectedStatus, setOverallSelectedStatus] = useState(0);


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

    // 전체 선택된 상태 변경 시 useEffect를 통해 일괄적으로 데이터 업데이트
    useEffect(() => {
        handleBatchStatus(overallSelectedStatus);
    }, [overallSelectedStatus]);

    // 선택된 항목이나 개별 배송 상태 변경 시 useEffect를 통해 데이터 다시 가져오기
    useEffect(() => {
        dataFetch();
        setOverallSelectedStatus(selectedDeliveryStatus);
    }, [props.checkedItems, props.setCheckedItems, props.matchedData, props.setMatchedData, selectedDeliveryStatus]);

    // 선택된 항목의 데이터 가져오는 함수
    function dataFetch() {
        if (!props.checkedItems) {
            selectedModalClose();
        }
        // 체크된 항목에 해당하는 데이터 가져오기
        const data = props.checkedItems.map(orderId => {
            const matchingData = props.matchedData.find(item => item.orderId === orderId);
            return matchingData;
        });

        setFetchedData(data);
    }

    // 전체 항목의 배송 상태 변경 함수
    function handleBatchStatus(val) {
        // FetchedData의 모든 항목의 배송 상태 일괄 업데이트
        setFetchedData((prevData) =>
            prevData.map((item) => ({
                ...item,
                deliveryStatus: val,
            }))
        );
    }

    // 개별 항목의 배송 상태 변경 함수
    function handlePerStatus(orderId, e) {
        const selectedStatus = parseInt(e.target.value, 10);

        if (selectedStatus === 1 || selectedStatus === 2 || selectedStatus === 3 || selectedStatus === 4) {
            // 선택된 항목의 배송 상태 업데이트
            const updatedData = fetchedData.map(item => {
                if (item.orderId === orderId) {
                    return {
                        ...item,
                        deliveryStatus: selectedStatus
                    };
                }
                return item;
            });

            setFetchedData(updatedData);
        } else {
            alert("잘못된 선택입니다.");
        }
    }

    // 변경사항 적용
    function applyStatus() {
        // FetchData에서 가져온 데이터로 MatchedData 업데이트
        props.setMatchedData((prevData) =>
            prevData.map((item) => ({
                ...item,
                deliveryStatus: fetchedData.find((dataItem) => dataItem.orderId === item.orderId).deliveryStatus,
            }))
        );
        // 모달 닫기 또는 필요한 작업 수행
        selectedModalClose();
        props.setCheckedItems([]);
    }


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
                            <th>택배사</th>
                            <th>송장 번호</th>
                            <th>처리상태</th>
                            <th>주문일자</th>
                            <th>상품코드</th>
                            <th>이미지</th>
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
                                    className={styles.handler}
                                    value={
                                        fetchedData.length > 0 && fetchedData.every(item => item?.deliveryStatus === fetchedData[0]?.deliveryStatus)
                                            ? fetchedData[0].deliveryStatus
                                            : 0
                                    }
                                    onChange={(e) => {
                                        const selectedValue = parseInt(e.target.value, 10);
                                        setOverallSelectedStatus(selectedValue);
                                        handleBatchStatus(selectedValue);
                                    }}
                                >
                                    <option value={0}>개별 선택</option>
                                    <option value={1}>배송 준비</option>
                                    <option value={2}>배송 중</option>
                                    <option value={3}>배송 완료</option>
                                    <option value={4}>배송 지연</option>
                                </select>
                            </th>
                            <th></th>
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
                                <td>{item.orderId}</td>
                                {/* 택배사 */}
                                <td>{item.deliverySelect}</td>
                                {/* 송장 번호 */}
                                <td>{item.delivery_num}</td>
                                {/* 배송상태 */}
                                <td>
                                    <select
                                        className={styles.handler}
                                        value={item.deliveryStatus}
                                        onChange={(e) => {
                                            handlePerStatus(item.orderId, e);
                                        }}
                                    >
                                        <option value={1}>배송 준비</option>
                                        <option value={2}>배송 중</option>
                                        <option value={3}>배송 완료</option>
                                        <option value={4}>배송 지연</option>
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

                {/* 적용 버튼 */}
                <button className={styles.applyButton} onClick={applyStatus}>
                    적용
                </button>

            </div>
        </div>
    );
}
