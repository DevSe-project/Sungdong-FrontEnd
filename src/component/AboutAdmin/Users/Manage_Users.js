import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import SortUserList from '../Users/SortUserList';
import FilterSearchUser from '../Users/FilterSearchUser';
import styles from './Manage_Users.module.css';
import axios from '../../../axios';
import { useUserFilter, useUserSort } from '../../../Store/DataStore';

export default function Manage_Users() {
    const userFilter = useUserFilter();
    const queryClient = useQueryClient();
    const userSort = useUserSort();

    //유저 데이터 fetch
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


    //유저 필터링 fetch
    const fetchFilteredUserData = async (userFilterData) => {
        try {
        const response = await axios.post("/auth/userFilter",
            JSON.stringify(
                userFilterData
            ),
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
    } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('조건에 일치하는 유저가 없습니다.');
    }
    };

    //유저 필터링 fetch
    const fetchSortedUserData = async (userFilterData) => {
        try {
        const response = await axios.post("/auth/userSort",
            JSON.stringify(
                userFilterData
            ),
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
    } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('정렬할 순위가 없습니다.');
    }
    };

    const { data:users, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUserData
    })


    const {mutate:filterMutation} = useMutation({mutationFn: fetchFilteredUserData})
    const {mutate:sortMutation} = useMutation({mutationFn: fetchSortedUserData})



    const onFiltering = () => {
        filterMutation(userFilter,{
            onSuccess: (data) => {
                console.log('user Filtered successfully:', data);
                alert(data.message);
                // 다른 로직 수행 또는 상태 업데이트
                queryClient.setQueryData(['users'], () => {
                    return data.data
                })
            },
            onError: (error) => {
                console.error('user Filtered failed:', error);
                // 에러 처리 또는 메시지 표시
                alert(error.message);
            },
            });
    };



    const [sortBy, setSortBy] = useState([]);
    
    const handleSort = () => {
        sortMutation(userSort,{
            onSuccess: (data) => {
                console.log('user Sorted successfully:', data);
                alert(data.message);
                // 다른 로직 수행 또는 상태 업데이트
                queryClient.setQueryData(['users'], () => {
                    return data.data
                })
            },
            onError: (error) => {
                console.error('user Sorted failed:', error);
                // 에러 처리 또는 메시지 표시
                alert(error.message);
            },
            });
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
                        <FilterSearchUser onFiltering={onFiltering} />
                        <SortUserList sortBy={sortBy} onSort={handleSort} />
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
                                    <td>{user.cor_tel}</td>
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
