import React from 'react';
import { db } from '../../../firebase';
import { useQuery } from 'react-query';
import { AdminHeader } from '../AdminHeader';
import { AdminMenuData } from '../AdminMenuData';
import FilterSearch_User from './FilterSearch_User';
import styles from './Manage_Users.module.css';
import Sort_UserList from './Sort_UserList';

export default function Manage_Users() {
    
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['users']
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    return (
        <div>
            <AdminHeader />
            <div className={styles.body}>
                <AdminMenuData />
                <div className={styles.mainContainer}>
                    <div className={styles.filtSort_container}>
                        <FilterSearch_User />
                        <Sort_UserList />
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>등급</th>
                                <th>이름</th>
                                <th>비밀번호</th>
                                <th>CMS 여부</th>
                                <th>회원 탈퇴</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.usertype}</td>
                                    <td>{user.grade}</td>
                                    <td>{user.name}</td>
                                    <td>{user.password}</td>
                                    <td>{user.CMS}</td>
                                    <td>회원삭제</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
