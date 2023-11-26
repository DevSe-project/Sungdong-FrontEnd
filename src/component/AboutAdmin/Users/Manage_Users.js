// Manage_Users.js

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader } from '../AdminHeader';
import { AdminMenuData } from '../AdminMenuData';
import FilterSearch_User from './FilterSearch_User';
import Sort_UserList from './Sort_UserList';
import styles from './Manage_Users.module.css';

export default function Manage_Users() {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['users']
    });

    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState([]);

    const handleSort = () => {
        // 정렬 로직 구현
        // sortBy 배열을 기반으로 데이터를 정렬하고 setSortedData를 통해 업데이트
        // 예: 정렬 로직 구현 후 setSortedData(sortedData)
    };

    useMemo(() => {
        // data나 sortBy가 변경될 때마다 정렬
        // handleSort();
    }, [data, sortBy]);

    const handleDelete = (id) => {
        // 회원 삭제 로직 구현
        // 예: 삭제 로직 구현 후 setSortedData(filteredData)
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (isError) {
        return <div>오류가 발생했습니다.</div>;
    }

    return (
        <div>
            <AdminHeader />
            <div className={styles.body}>
                <AdminMenuData />
                <div className={styles.mainContainer}>
                    <div className={styles.filtSortContainer}>
                        <FilterSearch_User />
                        <Sort_UserList sortBy={sortBy} onSort={handleSort} />
                    </div>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>업체명</th>
                                <th>등급</th>
                                <th>CMS 여부</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.usertype}</td>
                                    <td>{user.bizname}</td>
                                    <td>{user.grade}</td>
                                    <td>{user.CMS ? "동의" : "비동의"}</td>
                                    <td>
                                        <button className={styles.button}
                                            onClick={() => handleDelete(user.id)}>
                                            회원 삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
