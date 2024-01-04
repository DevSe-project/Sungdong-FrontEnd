import { useQuery } from '@tanstack/react-query';
import styles from './Deli_InquireTable.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function Deli_InquireTable() {
    const queryClient = useQueryClient();

    const { isLoading: deliveryLoading, isError: deliveryError, data: delivery } = useQuery({ queryKey: ['delivery'] });
    const { isLoading: orderedLoading, isError: orderedError, data: ordered } = useQuery({ queryKey: ['ordered'] });

    // 데이터 로딩 중 또는 에러 발생 시 처리
    if (deliveryLoading || orderedLoading) {
        return <p>Loading...</p>;
    }

    if (deliveryError || orderedError) {
        return <p>Error fetching data</p>;
    }

    // orderID를 기준으로 두 데이터를 매칭
    const matchedData = ordered.map(orderItem => {
        const deliveryItem = delivery.find(deliveryItem => deliveryItem.orderID === orderItem.orderID);

        // orderData와 deliveryData의 항목을 합침
        return { ...orderItem, ...deliveryItem };
    });

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        const startIndex = (currentPage - 1) * 5;
        return matchedData.slice(startIndex, startIndex + 5);
    };

    return (
        <div>
            <table>
                <thead
                    style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                >
                    <tr>
                        <th>주문번호</th>
                        <th>처리상태</th>
                        <th>주문일자</th>
                        <th>상품코드</th>
                        <th>이미지</th>
                        <th>표준가</th>
                        <th>상품명</th>
                        <th>옵션명</th>
                        <th style={{ fontWeight: '650' }}>공급가</th>
                        <th>더보기</th>
                    </tr>
                </thead>
                <tbody>
                    {getCurrentPagePosts().map((item, index) => (
                        <tr key={index}>
                            <td>{item.orderID}</td>
                            <td>{item.deliveryType}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.buttonContainer}>
                {/* 이전 페이지 */}
                <button className={styles.button} onClick={() => {
                    if (currentPage !== 1) {
                        setCurrentPage(currentPage - 1);
                    } else {
                        alert("해당 페이지가 가장 첫 페이지 입니다.");
                    }
                }}>
                    <i className="far fa-angle-left" />
                </button>
                <div className={styles.button}> {currentPage} </div>
                {/* 다음 페이지 */}
                <button className={styles.button} onClick={() => {
                    if (matchedData.length > currentPage * 5) {
                        setCurrentPage(currentPage + 1);
                    } else {
                        alert("다음 페이지가 없습니다.");
                    }
                }}>
                    <i className="far fa-angle-right" />
                </button>
            </div>
        </div>
    );
}
