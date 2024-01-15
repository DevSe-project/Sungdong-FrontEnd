import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './Deli_InquireTable.module.css';
import InvoiceModal from '../InvoiceModal/InvocieModal';

export default function Deli_InquireTable() {
    const queryClient = useQueryClient();

    const { isModal } = useModalState();
    const { setIsModal, openModal, closeModal } = useModalActions();

    // Fetch
    const { isLoading: deliveryLoading, isError: deliveryError, data: delivery } = useQuery({ queryKey: ['delivery'] });
    const { isLoading: orderedLoading, isError: orderedError, data: ordered } = useQuery({ queryKey: ['ordered'] });
    const { isLoading: productLoading, isError: productError, data: product } = useQuery({ queryKey: ['data'] });

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [matchedData, setMatchedData] = useState([]);

    // 업데이트된 데이터의 체크 상태를 관리하는 state
    const [checkedItems, setCheckedItems] = useState([]);

    // 선택된 배송상태를 담는다
    const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState(0);



    // 업데이트 함수 호출
    useEffect(() => {
        updateMatchedData();
    }, [currentPage, ordered, delivery, product]);

    useEffect(() => {
        console.log(matchedData);
    }, [matchedData])


    function directUpdate_deliveryStatus(e, currentStatus) {
        const updateStatus = e.target.value;

        if (updateStatus === 1 || updateStatus === 2 || updateStatus === 3) {

        } else {
            alert("잘못된 선택입니다.");
        }
    }


    // 전체 체크박스 업데이트
    function handleAllCheckbox(e) {
        const checked = e.target.checked;

        if (checked) {
            // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            let idArray = getCurrentPagePosts()?.map((item) => item.orderId);
            setCheckedItems(idArray);
        } else {
            // 모두 체킹 해제
            setCheckedItems([]);
        }
    }



    // 체크박스 개별 업데이트
    function handlePerCheckbox(checked, orderID) {
        if (checked) {
            // 단일 선택 시 체크된 아이템을 배열에 추가
            setCheckedItems(prev => [...prev, orderID]);
        } else {
            // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
            setCheckedItems(checkedItems.filter((el) => el !== orderID));
        }
    }



    // 선택된 항목의 배송상태를 일괄 변경
    function batchChange_deliveryStatus(e) {
        const updateStatus = parseInt(e.target.value, 10); // 10진수로 parse

        // 1, 2, 3 중에 값이 있어야 함수 동작
        if (updateStatus === 1 || updateStatus === 2 || updateStatus === 3) {
            if (window.confirm("변경하시겠습니까?")) {
                // 선택된 항목들에 대해 새로운 배송 상태 설정
                const updatedData = matchedData.map(item => {
                    if (checkedItems.includes(item.orderId)) {
                        return {
                            ...item,
                            deliveryStatus: updateStatus
                        };
                    }
                    return item;
                });

                // 일괄 변경된 데이터로 상태 업데이트
                setMatchedData(updatedData);
            } else {
                setSelectedDeliveryStatus(0); // initialize
                alert("수정이 취소되었습니다.");
            }
        }
        else {
            alert("잘못된 선택입니다.");
            setSelectedDeliveryStatus(0);
        }
    }


    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return matchedData.slice(startIndex, startIndex + itemsPerPage);
    };



    // 상태 업데이트를 위한 함수
    const updateMatchedData = () => {
        // 해당 데이터가 모두 불러와졌을 때만 함수 실행, 하나라도 데이터가 로딩되지 않았다면 함수 종료
        if (!ordered || !delivery || !product) {
            return;
        }
        // ordered와 delivery, product 매칭
        const finalMatchedData = ordered.map(orderItem => {
            const deliveryItem = delivery.find(
                deliveryItem => deliveryItem.orderId === orderItem.id
            );
            const productItem = product.find(
                productItem => productItem.id === orderItem.ProductId
            );

            console.log("update");
            return { ...orderItem, ...deliveryItem, ...productItem };
        });

        setMatchedData(finalMatchedData);
        console.log("render");
    };



    // 데이터 로딩 중 또는 에러 발생 시 처리
    if (deliveryLoading || orderedLoading || productLoading) {
        return <p>Loading...</p>;
    }
    if (deliveryError || orderedError || productError) {
        return <p>Error fetching data</p>;
    }



    return (
        <div className={styles.body}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.header_txt}>
                    목록
                </div>
                <select className={styles.denoteNumber_select}
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                    <option value={1}>1</option>
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                </select>
            </div>

            {/* Main : List Of Delivery Status */}
            <table>
                {/* Column Names */}
                <thead
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <tr>
                        <th>
                            <input type='checkbox'
                                checked={checkedItems.length === getCurrentPagePosts().length ? true : false}
                                onChange={(e) => handleAllCheckbox(e)} />
                        </th>
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
                    {matchedData &&
                        getCurrentPagePosts()?.map((item, index) => (
                            <tr key={index}>
                                {/* 체크박스 */}
                                <td>
                                    <input type='checkbox'
                                        checked={checkedItems.includes(item.orderId) ? true : false}
                                        onChange={(e) => handlePerCheckbox(e.target.checked, item.orderId)} />
                                </td>
                                {/* 주문번호 */}
                                <td>{item.orderId}</td>
                                {/* 배송상태 */}
                                <td>
                                    <select
                                        className={styles.handler}
                                        value={item.deliveryStatus}
                                        onChange={(e) => {
                                            directUpdate_deliveryStatus(e, item.deliveryStatus); // temp
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

            {/* Page Move */}
            <div className={styles.pageMoveHandler}>
                <button className={styles.moveButton} onClick={() => {
                    if (currentPage !== 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        alert("해당 페이지가 가장 첫 페이지 입니다.");
                    }
                }}>
                    <i className="far fa-angle-left" />
                </button>
                <div className={styles.currentPage}> {currentPage} </div>
                <button className={styles.moveButton} onClick={() => {
                    if (matchedData.length > currentPage * 5) {
                        setCurrentPage(currentPage + 1);
                    } else {
                        alert("다음 페이지가 없습니다.");
                    }
                }}>
                    <i className="far fa-angle-right" />
                </button>
            </div>

            {/* HandlerPost */}
            <div className={styles.checkedAllProcessingPost}>
                선택 항목 일괄처리
            </div>
            {/* Checkedbox */}
            <table className={styles.checkedboxHandleTable}>
                {/* Processing CheckedAll - deliveryType */}
                <tr>
                    <th>배송 상태</th>
                    <td>
                        <select
                            className={styles.handler}
                            value={selectedDeliveryStatus}
                            onChange={(e) => { setSelectedDeliveryStatus(e.target.value) }}
                        >
                            <option value={0}>선택</option>
                            <option value={1}>배송 준비</option>
                            <option value={2}>배송 중</option>
                            <option value={3}>배송 완료</option>
                        </select>

                        <button className={styles.button} value={selectedDeliveryStatus} onClick={(e) => batchChange_deliveryStatus(e)}>
                            적용
                        </button>
                    </td>
                </tr>
                {/* Processing CheckedAll - Transportation */}
                <tr>
                    {/* 체크된 데이터가 invoiceModal로 전송되어야 한다. */}
                    <th>정보 수정</th>
                    <td><button
                        className={styles.handler}
                        onClick={ () => { openModal() } }>
                        송장 수정
                    </button></td>
                </tr>
                {/* Processing CheckedAll - Cancel */}
                <tr>
                    <th>취소 처리</th>
                    <td>
                        <button className={styles.handler}>일괄 취소</button>
                    </td>
                </tr>
            </table>

            {/* 송장 수정 모달 */}
            {isModal == true ? <InvoiceModal /> : "Null"}
        </div>
    );
}
