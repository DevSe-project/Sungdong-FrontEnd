import React from 'react';
import styles from './AdminUserSort.module.css';
import { useUserFilterActions, useUserSort } from '../../../store/DataStore';

const AdminUserSort = (props) => {
    const userSort = useUserSort();
    const { setUserSort, resetUserSort } = useUserFilterActions();

    const optionsArr = [
        {
            value: "",
            key: "선택없음",
        },
        {
            value: "u.userType_id",
            key: "고객구분",
        },
        {
            value: "uc.cor_corName",
            key: "업체명(상호명)",
        },
        {
            value: "ui.hasCMS",
            key: "CMS동의여부"
        }
    ];

    return (
        <div className={styles.body}>

            <div className={styles.title}>정렬 우선순위</div>

            <div className={styles.sortItems}>
                {/* 정렬은 3개까지만 */}
                {[1, 2, 3].map((priority) => (
                    <label key={priority}>
                        {priority}순위
                        <select
                            className={styles.sortSelect}
                            value={priority === 1 ? userSort.first
                                : priority === 2 ? userSort.second
                                    : priority === 3 && userSort.third}
                            onChange={(e) => setUserSort(priority === 1 ? "first"
                                : priority === 2 ? "second"
                                    : priority === 3 && "third", e.target.value)}
                        >
                            {/* 옵션 배열의 객체들을 map으로 풂. */}
                            {optionsArr.map((item, index) => (
                                <option key={index} value={item.value}>{item.key}</option>
                            ))}
                        </select>
                    </label>
                ))}
            </div>

            <button className="white_round_button" onClick={() => resetUserSort()}>초기화</button>
            <button style={{ marginTop: '16px' }} className='original_round_button' onClick={props.onSort}>정렬하기</button>
        </div>
    );
};

export default AdminUserSort;
