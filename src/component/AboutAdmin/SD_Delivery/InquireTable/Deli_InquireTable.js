import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import styles from './Deli_InquireTable.module.css';
import axios from 'axios';




export default function Deli_InquireTable() {

    const queryClient = useQueryClient();

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    const [matchedData, setMatchedData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);


    // Fetch
    const { isLoading: deliveryLoading, isError: deliveryError, data: delivery } = useQuery({ queryKey: ['delivery'] });
    const { isLoading: orderedLoading, isError: orderedError, data: ordered } = useQuery({ queryKey: ['ordered'] });
    const { isLoading: productLoading, isError: productError, data: product } = useQuery({ queryKey: ['data'] });


    // 업데이트 함수 호출
    useEffect(() => {
        updateMatchedData();
    }, [currentPage, ordered, delivery, product]);


    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return matchedData.slice(startIndex, startIndex + itemsPerPage);
    };


    // deliveryType을 수정하기 위한 함수
    const updateFirebaseDelivery = () => {

    };


    // 상태 업데이트를 위한 함수
    const updateMatchedData = () => {
        if (!ordered || !delivery || !product) {
            return;
        }

        // orderID를 기준으로 ordered와 delivery를 매칭
        const matchedDelivery = ordered.map(orderItem => {
            const deliveryItem = delivery.find(deliveryItem => deliveryItem.orderID === orderItem.orderID);
            return { ...orderItem, ...deliveryItem };
        });

        // productId를 기준으로 matchedDelivery와 product를 매칭
        const finalMatchedData = matchedDelivery.map(matchedItem => {
            const productItem = product.find(productItem => productItem.productId === matchedItem.productId);
            return { ...matchedItem, ...productItem };
        });

        setMatchedData(finalMatchedData);
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
            {/* header */}
            <div className={styles.header}>
                {/* Post */}
                <div className={styles.header_txt}>
                    목록
                </div>
                {/* Number of Denote */}
                <select className={styles.denoteNumber_select}
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
            </div>
            {/* main */}
            <table>
                <thead
                    style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                >
                    <tr>
                        <th><input type='checkbox' /></th>
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
                <tbody>
                    {getCurrentPagePosts().map((item, index) => (
                        <tr key={index}>
                            <td><input type='checkbox' /></td>
                            <td>{item.orderID}</td> {/* 주문번호 */} {/* get으로 불러오기 */}
                            <td> {/* 처리상태 */}
                                <select
                                    value={item.deliveryType}
                                    onChange={() => { }}
                                >
                                    <option value={1}>배송 준비</option>
                                    <option value={2}>배송 중</option>
                                    <option value={3}>배송 완료</option>
                                </select>
                            </td>
                            <td>{item.order_Date}</td> {/* 주문일자 */}
                            <td>{item.ProductId}</td> {/* 상품코드 */}
                            <td>{item.image.mini}</td> {/* 이미지 */}
                            <td>{item.title}</td> {/* 상품명 */}
                            <td>{item.option ? item.option : "-"}</td> {/* 옵션명 */}
                            <td>{item.price}</td> {/* 표준가 */}
                            <td>{item.discount === 0 ? item.price : item.price - (item.price * item.discount / 100)}</td> {/* 공급가 */}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pageMoveHandler}>
                {/* 이전 페이지 */}
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
                {/* 다음 페이지 */}
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
