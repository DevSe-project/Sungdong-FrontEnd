import React, { useState } from 'react';
import styles from './TotalCal_Manage.module.css';
import { AdminHeader } from '../AdminHeader';
import { AdminMenuData } from '../AdminMenuData';

const TotalCal_Manage = () => {
    // 임시 총 주문 데이터 30개
    const transactionData = [
        { id: 1, name: '회원1', date: '2023-01-01', description: '상품 구매', amount: 100000, status: '완료' },
        { id: 2, name: '회원2', date: '2023-01-02', description: '서비스 이용', amount: 75000, status: '처리 중' },
        { id: 3, name: '회원3', date: '2023-01-03', description: '할인 적용', amount: 120000, status: '완료' },
        { id: 4, name: '회원4', date: '2023-01-04', description: '포인트 사용', amount: 90000, status: '취소' },
        { id: 5, name: '회원5', date: '2023-01-05', description: '상품 구매', amount: 80000, status: '완료' },
        { id: 6, name: '회원6', date: '2023-01-06', description: '서비스 이용', amount: 60000, status: '완료' },
        { id: 7, name: '회원7', date: '2023-01-07', description: '할인 적용', amount: 130000, status: '처리 중' },
        { id: 8, name: '회원8', date: '2023-01-08', description: '포인트 사용', amount: 70000, status: '완료' },
        { id: 9, name: '회원9', date: '2023-01-09', description: '기타', amount: 110000, status: '처리 중' },
        { id: 10, name: '회원10', date: '2023-01-10', description: '상품 구매', amount: 95000, status: '취소' },
        { id: 11, name: '회원11', date: '2023-01-11', description: '서비스 이용', amount: 70000, status: '완료' },
        { id: 12, name: '회원12', date: '2023-01-12', description: '할인 적용', amount: 120000, status: '처리 중' },
        { id: 13, name: '회원13', date: '2023-01-13', description: '기타', amount: 85000, status: '취소' },
        { id: 14, name: '회원14', date: '2023-01-14', description: '상품 구매', amount: 90000, status: '완료' },
        { id: 15, name: '회원15', date: '2023-01-15', description: '포인트 사용', amount: 110000, status: '처리 중' },
        { id: 16, name: '회원16', date: '2023-01-16', description: '할인 적용', amount: 130000, status: '완료' },
        { id: 17, name: '회원17', date: '2023-01-17', description: '상품 구매', amount: 100000, status: '처리 중' },
        { id: 18, name: '회원18', date: '2023-01-18', description: '기타', amount: 95000, status: '완료' },
        { id: 19, name: '회원19', date: '2023-01-19', description: '포인트 사용', amount: 80000, status: '완료' },
        { id: 20, name: '회원20', date: '2023-01-20', description: '할인 적용', amount: 120000, status: '취소' },
        { id: 21, name: '회원21', date: '2023-01-21', description: '상품 구매', amount: 100000, status: '완료' },
        { id: 22, name: '회원22', date: '2023-01-22', description: '서비스 이용', amount: 75000, status: '처리 중' },
        { id: 23, name: '회원23', date: '2023-01-23', description: '할인 적용', amount: 120000, status: '완료' },
        { id: 24, name: '회원24', date: '2023-01-24', description: '포인트 사용', amount: 90000, status: '취소' },
        { id: 25, name: '회원25', date: '2023-01-25', description: '상품 구매', amount: 80000, status: '완료' },
        { id: 26, name: '회원26', date: '2023-01-26', description: '서비스 이용', amount: 60000, status: '완료' },
        { id: 27, name: '회원27', date: '2023-01-27', description: '할인 적용', amount: 130000, status: '처리 중' },
        { id: 28, name: '회원28', date: '2023-01-28', description: '포인트 사용', amount: 70000, status: '완료' },
        { id: 29, name: '회원29', date: '2023-01-29', description: '기타', amount: 110000, status: '처리 중' },
        { id: 30, name: '회원30', date: '2023-01-30', description: '상품 구매', amount: 95000, status: '취소' },
    ];

    // ----------------- 삽입 예상 기능 ----------------- //
    // 총 정산 완료 기대 금액
    const totalAmount = transactionData.reduce((acc, transaction) => acc + transaction.amount, 0);
    const formated_num = totalAmount.toLocaleString(); // 천 단위로 구분
    // 정산 완료 금액

    // 정산 대기 금액

    // 정상 예정 금액
    // -------------------------------------------------- //

    const [filter, setFilter] = useState('모두');

    const handleFilter = (status) => {
        setFilter(status);
    };

    const filteredData = transactionData.filter((transaction) => {
        if (filter === '모두') return true;
        return transaction.status === filter;
    });

    return (
        <div>
            <AdminHeader />
            <div className={styles.flex_container}>
                <AdminMenuData />
                <div className={styles.main_container}>
                    <header className={styles.header}>
                        <h3>누적 정산 금액:
                            <span className={styles.totalAccount}>
                                {formated_num}
                            </span>
                            원
                        </h3>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.filter_buttons}>
                            <button onClick={() => handleFilter('모두')}
                                className={
                                    filter === '모두'
                                        ?
                                        `${styles.filter_button} ${styles.active}`
                                        :
                                        styles.filter_button
                                }>
                                모두 보기
                            </button>
                            <button onClick={() => handleFilter('완료')}
                                className={
                                    filter === '완료'
                                        ?
                                        `${styles.filter_button} ${styles.active}`
                                        :
                                        styles.filter_button
                                }>
                                정산 완료
                            </button>
                            <button onClick={() => handleFilter('처리 중')}
                                className={
                                    filter === '처리 중'
                                        ?
                                        `${styles.filter_button} ${styles.active}`
                                        :
                                        styles.filter_button
                                }>
                                처리 중
                            </button>
                            {/* 필터 버튼 추가 */}
                            {/* ... */}
                        </div>

                        <section>
                            <h4>정산 내용</h4>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>회원 이름</th>
                                        <th>날짜</th>
                                        <th>거래 내역</th>
                                        <th>금액</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.id}</td>
                                            <td>{transaction.name}</td>
                                            <td>{transaction.date}</td>
                                            <td>{transaction.description}</td>
                                            <td>{transaction.amount}</td>
                                            <td>{transaction.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.btn_container}>
                                <button className={styles.btn}>정산하기</button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default TotalCal_Manage;
