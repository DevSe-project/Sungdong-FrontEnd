import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './Deli_InquireTable.module.css';
import { useState, React } from 'react';

export default function Deli_InquireTable() {


    const queryClient = useQueryClient();
    const { isLoading, isError, error, data: delivery } = useQuery({ queryKey: ['delivey'] })
    const { data: ordered } = useQuery({ queryKey: ['ordered'] });

    // 주문번호를 기준으로 delivery와 order를 매칭하는 함수
    const getMatchedData = (orderID) => {
        const matchedData = ordered.filter(item => item.ordered.orderID === orderID);
        return matchedData;
    };


    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);

    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
        const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
        return delivery.slice(startIndex, startIndex + 5);
    };


    // 로딩 | 에러
    if (isLoading) {
        return <p>Loading..</p>;
    }
    if (isError) {
        return <p>에러 : {error.message}</p>;
    }


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
                    {delivery && getCurrentPagePosts().map((item, index) => (
                        <React.Fragment key={index}>
                            {/* orderID를 기준으로 delivery와 order를 매칭하여 데이터 가져오기 */}
                            {getMatchedData(item.orderID).map((matchedItem, matchedIndex) => (
                                <tr key={matchedIndex}>
                                    <td>{matchedItem.orderID}</td>
                                    <td>{matchedItem.status}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>


            <div className={styles.buttonContainer}>
                {/* 이전 페이지 */}
                <button className={styles.button} onClick={() => {
                    if (currentPage !== 1) {
                        setCurrentPage(currentPage - 1)
                    }
                    else {
                        alert("해당 페이지가 가장 첫 페이지 입니다.")
                    }
                }}>
                    <i className="far fa-angle-left" />
                </button>
                <div className={styles.button}> {currentPage} </div>
                {/* 다음 페이지 */}
                <button className={styles.button} onClick={() => {
                    if (delivery.length > (currentPage * 5)) {
                        setCurrentPage(currentPage + 1);
                    }
                    else {
                        alert("다음 페이지가 없습니다.")
                    }
                }}>
                    <i className="far fa-angle-right" />
                </button>
            </div>
        </div >
    )
}