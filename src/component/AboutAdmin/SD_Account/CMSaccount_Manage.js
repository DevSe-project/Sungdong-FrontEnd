import React, { useState } from 'react';
import styles from './CMSaccount_Manage.module.css';
import { AdminHeader } from '../AdminHeader';
import { AdminMenuData } from '../AdminMenuData';

const CMSaccount_Manage = () => {
    const [accounts, setAccounts] = useState([
        { id: 1, username: 'admin1', role: 'Admin', status: 'Completed' },
        { id: 2, username: 'user1', role: 'User', status: 'Incomplete' },
    ]);

    const [filter, setFilter] = useState('Incomplete');

    const handleFilter = (status) => {
        setFilter(status);
    };

    const filteredAccounts = accounts.filter(account => {
        if (filter === 'All') return true;
        return account.status === filter;
    });

    const sortedAccounts = [...filteredAccounts].sort((a, b) => {
        if (a.status === 'Incomplete' && b.status === 'Completed') return -1;
        if (a.status === 'Completed' && b.status === 'Incomplete') return 1;
        return 0;
    });

    return (
        <div>
            <AdminHeader />
            <div className={styles.flex_container}>
                <AdminMenuData />
                <div className={styles.main_container}>
                    <header className={styles.header}>
                        <h3>CMS 계정 관리</h3>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.filter_buttons}>
                            <button onClick={() => handleFilter('All')}
                                className={
                                    filter === 'All'
                                        ?
                                        `${styles.filter_button} ${styles.active}`
                                        :
                                        styles.filter_button
                                }>
                                모두 보기
                            </button>
                            <button onClick={() => handleFilter('Completed')}
                                className={filter === 'Completed' ? `${styles.filter_button} ${styles.active}`
                                    :
                                    styles.filter_button
                                }>
                                정산 완료
                            </button>
                            <button onClick={() => handleFilter('Incomplete')}
                                className={
                                    filter === 'Incomplete'
                                        ?
                                        `${styles.filter_button} ${styles.active}`
                                        :
                                        styles.filter_button
                                }>
                                정산 미완료
                            </button>
                        </div>

                        <section>
                            <h4>회원 목록</h4>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>사용자명</th>
                                        <th>역할</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAccounts.map((account) => (
                                        <tr key={account.id}>
                                            <td>{account.id}</td>
                                            <td>{account.username}</td>
                                            <td>{account.role}</td>
                                            <td>{account.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CMSaccount_Manage;
