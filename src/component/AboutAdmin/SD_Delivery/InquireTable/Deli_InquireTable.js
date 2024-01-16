import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './Deli_InquireTable.module.css';
import InvoiceModal from '../Modal/InvoiceModal';
import DeliveryStateModal from '../Modal/DeliveryStateModal';

export default function Deli_InquireTable() {
    const queryClient = useQueryClient();


    // relative modal state
    const { isModal, modalName } = useModalState();
    const { openModal, selectedModalOpen } = useModalActions();

    // Fetch data
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
        if (ordered && delivery && product) {
            updateMatchedData();
        }
    }, [currentPage, ordered, delivery, product]);
    // (Effect연결함수) 상태 업데이트를 위한 함수
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




    // 배송상태 파싱
    function parseDeliveryState(val) {
        console.log(val);
        const parseVal = parseInt(val);
        switch (parseVal) {
            case 1:
                return '배송 준비';
            case 2:
                return '배송 중';
            case 3:
                return '배송 완료';
            default:
                alert('배송 상태를 불러들이지 못했습니다.');
                return 'null';
        }
    }




    // 배송 개별 상태 업데이트
    function updateAllState(e, currentStatus) {
        const updateStatus = parseInt(e.target.value, 10);

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



    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        if (!matchedData) {
            return [];
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        return matchedData.slice(startIndex, startIndex + itemsPerPage);
    };


    // 배송 상태 변경 모달 열기 조건 확인
    const handleModalOpen = (name) => {
        if (checkedItems.length > 0) {
            selectedModalOpen(name); // 선택된 아이템이 있으면 배송 상태 변경 모달 열기
        } else {
            alert('아이템을 선택하세요.'); // 선택된 아이템이 없으면 경고 메시지 표시
        }
    };



    // 데이터 로딩 중 또는 에러 발생 시 처리
    if (deliveryLoading || orderedLoading || productLoading) {
        return <p>Loading...</p>;
    }
    if (deliveryError || orderedError || productError) {
        return <p>Error fetching data</p>;
    }



    return (
        matchedData ? <div className={styles.body}>
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

            {/* 선택항목일괄처리 */}
            <div className={styles.selectedHandler}>
                {/* 배송상태 수정 */}
                <button
                    className={styles.button}
                    onClick={() => { handleModalOpen('DeliveryStateModal') }}>
                    선택 항목 수정(배송상태)
                </button>
                {/* 송장 수정 */}
                <button
                    className={styles.button}
                    // 송장수정 fn
                    onClick={() => { handleModalOpen('InvoiceModal') }}>
                    선택 항목 수정(송장)
                </button>
                {/* 일괄 배송 취소 */}
                <button
                    className={styles.button}
                    onClick={() => {

                    }}>
                    {/* 배송 상태 리스트에서 삭제 */}
                    배송 취소
                </button>
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
                                <td>{parseDeliveryState(item.deliveryStatus)}</td>
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



            {/* 배송 상태 변경 모달 */}
            {
                isModal && modalName === 'DeliveryStateModal'
                    ?
                    <DeliveryStateModal
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        matchedData={matchedData}
                        setMatchedData={setMatchedData}
                        updateAllState={updateAllState}
                        setSelectedDeliveryStatus={setSelectedDeliveryStatus} />
                    :
                    null
            }
            {/* 송장 변경 모달 */}
            {
                isModal && modalName === 'InvoiceModal'
                    ?
                    <InvoiceModal
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        matchedData={matchedData}
                        setMatchedData={setMatchedData} />
                    :
                    null
            }
        </div>
            : null
    );
}
