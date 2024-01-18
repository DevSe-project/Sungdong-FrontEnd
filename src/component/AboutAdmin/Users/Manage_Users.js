import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import Sort_UserList from '../Users/Sort_UserList';
import FilterSearch_User from '../Users/FilterSearch_User';
import styles from './Manage_Users.module.css';
import axios from '../../../axios';

export default function Manage_Users() {

      //토큰 데이터 fetch
    const fetchAllUserData = async () => {
        try {
        const response = await axios.get("/auth/userAll",
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data.data;
    } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('확인 중 오류가 발생했습니다.');
    }
    };

    const onFiltering = () => {
        // 여기에 검색을 위한 로직을 추가하면 됩니다.
        console.log("필터링이 완료되었습니다.")
        // 추가로 필요한 검색 로직을 작성하십시오.
    };


    const { data:users, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUserData
    })

    const [sortBy, setSortBy] = useState([]);
    
    const handleSort = () => {
        // 정렬 로직 구현
        // sortBy 배열을 기반으로 데이터를 정렬하고 setSortedData를 통해 업데이트
        // 예: 정렬 로직 구현 후 setSortedData(sortedData)
    };

    useMemo(() => {
        // data나 sortBy가 변경될 때마다 정렬
        // handleSort();
    }, [users, sortBy]);

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
                        <FilterSearch_User className={styles.FilterSearch_User} onFiltering={onFiltering} />
                        <Sort_UserList sortBy={sortBy} onSort={handleSort} className={styles.Sort_UserList} />
                    </div>

                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>업체명(상호명)</th>
                                <th>등급</th>
                                <th>주소</th>
                                <th>연락처</th>
                                <th>CMS 여부</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.userType_id === 1 ? "실 사용자" : "납품업자"}</td>
                                    <td>{user.cor_corName}</td>
                                    <td>{user.grade && user.grade}</td>
                                    <td>{user.bname} {user.roadAddress}({user.zonecode})</td>
                                    <td>{user.cor_num}</td>
                                    <td>{user.hasCMS === 1 ? "동의" : "비동의"}</td>
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
