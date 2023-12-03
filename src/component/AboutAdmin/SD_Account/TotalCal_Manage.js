// TotalCal_Manage.js

import React from 'react';
import styles from './TotalCal_Manage.module.css';
import { AdminHeader } from '../AdminHeader';
import { AdminMenuData } from '../AdminMenuData';

export default function TotalCal_Manage() {
    // 가상의 데이터 배열 (실제 데이터는 서버에서 가져와야 함)
    const transactionData = [
        { id: 1, name: '회원1', date: '2023-01-01', description: '상품 구매', amount: 100000, status: '완료' },
        // 다른 트랜잭션들 추가
    ];

    return (
        <div className={styles.body}>
            <AdminHeader />
            <div className={styles.container}>
                <AdminMenuData />
                <div className={styles.mainContainer}>
                    <header className={styles.header}>
                        <h1>회원 정산 페이지</h1>
                    </header>
                    <main className={styles.main}>
                        {/* 정산 내용을 표시하는 테이블 */}
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
                                {transactionData.map((transaction) => (
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
                        {/* 정산 버튼 */}
                        <button className={styles.btn}>정산하기</button>
                    </main>
                </div>
            </div>
        </div>
    );
}
