import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import styles from './Deli_InquireTable.module.css';

export default function Deli_InquireTable() {
    const queryClient = useQueryClient();

    // Fetch
    const { isLoading: deliveryLoading, isError: deliveryError, data: delivery } = useQuery({ queryKey: ['delivery'] });
    const { isLoading: orderedLoading, isError: orderedError, data: ordered } = useQuery({ queryKey: ['ordered'] });
    const { isLoading: productLoading, isError: productError, data: product } = useQuery({ queryKey: ['data'] });

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [matchedData, setMatchedData] = useState([]);

    // 전체 체크박스의 선택 상태를 담는다.
    const [isEveryCheckbox, setIsEveryCheckbox] = useState(false);

    // 업데이트된 데이터의 체크 상태를 관리하는 state
    const [checkedItems, setCheckedItems] = useState({});

    // 업데이트 함수 호출
    useEffect(() => {
        updateMatchedData();
    }, [currentPage, ordered, delivery, product]);

    // 페이지가 마운트될 때 초기화
    useEffect(() => {
        if (!isEveryCheckbox) {
            const initialCheckedState = matchedData.reduce((acc, item) => {
                acc[item.orderID] = false;
                return acc;
            }, {});
            setCheckedItems(initialCheckedState);
        }
    }, [isEveryCheckbox, matchedData]);

    // 전체 선택
    function selectEveryCheckbox() {
        const item = getCurrentPagePosts();
        const value = {};

        if (!isEveryCheckbox) {
            item.forEach((j) => {
                value[j.orderID] = true;
            });
            setIsEveryCheckbox(true);
        } else {
            setIsEveryCheckbox(false);
        }

        setCheckedItems(value);
    }

    // 개별 선택
    function selectPerCheckbox(orderID) {
        setCheckedItems((prev) => {
            const updatedCheckedItems = { ...prev, [orderID]: !prev[orderID] };

            // 모든 개별 항목이 선택되었는지 확인
            const allItemsSelected = getCurrentPagePosts().every((item) => updatedCheckedItems[item.orderID]);

            // 전체 선택 상태 업데이트
            setIsEveryCheckbox(allItemsSelected);

            return updatedCheckedItems;
        });
    }

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return matchedData.slice(startIndex, startIndex + itemsPerPage);
    };

    // 상태 업데이트를 위한 함수
    const updateMatchedData = () => {
        if (!ordered || !delivery || !product) {
            return;
        }

        const matchedDelivery = ordered.map(orderItem => {
            const deliveryItem = delivery.find(
                deliveryItem => deliveryItem.orderID === orderItem.orderID
            );
            return { ...orderItem, ...deliveryItem };
        });

        const finalMatchedData = matchedDelivery.map(matchedItem => {
            const productItem = product.find(
                productItem => productItem.productId === matchedItem.productId
            );

            const isChecked = checkedItems[matchedItem.orderID] || false;

            return { ...matchedItem, ...productItem, isChecked };
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
                                checked={isEveryCheckbox}
                                onChange={() => selectEveryCheckbox()} />
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
                    {getCurrentPagePosts().map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input type='checkbox'
                                    checked={checkedItems[item.orderID]}
                                    onChange={() => selectPerCheckbox(item.orderID)} />
                            </td>
                            <td>{item.orderID}</td>
                            <td>
                                <select
                                    value={item.deliveryStatus}
                                    onChange={() => { }}
                                >
                                    <option value={1}>배송 준비</option>
                                    <option value={2}>배송 중</option>
                                    <option value={3}>배송 완료</option>
                                </select>
                            </td>
                            <td>{item.order_Date}</td>
                            <td>{item.ProductId}</td>
                            <td>{item.image.mini}</td>
                            <td>{item.title}</td>
                            <td>{item.option ? item.option : "-"}</td>
                            <td>{item.price}</td>
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
                            value=''
                            onChange={() => { }}
                        >
                            <option value={1}>배송 준비</option>
                            <option value={2}>배송 중</option>
                            <option value={3}>배송 완료</option>
                        </select>
                    </td>
                </tr>
                {/* Processing CheckedAll - Transportation */}
                <tr>
                    <th>정보 수정</th>
                    <td><button className={styles.handler}>송장 수정</button></td>
                </tr>
                {/* Processing CheckedAll - Cancel */}
                <tr>
                    <th>취소 처리</th>
                    <td>
                        <button className={styles.handler}>일괄 취소</button>
                    </td>
                </tr>
            </table>
        </div>
    );
}
