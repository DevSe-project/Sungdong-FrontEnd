// Sort_UserList.js
import React from 'react';
import styles from './Sort_UserList.module.css';

const Sort_UserList = (props) => {
    const handleSort = () => {
        props.onSort();
    };

    const optionsArr = [
        {
            value: "",
            key: "선택없음",
        },
        {
            value: "userType",
            key: "고객유형",
        },
        {
            value: "bizname",
            key: "업체명(상호명)",
        },
        {
            value: "grade",
            key: "회원등급",
        },
    ];

    return (
        <div className={styles.body}>

            <div className={styles.title}>정렬 우선순위</div>

            <div className={styles.sortItems}>
                {/* 정렬은 3개까지만 */}
                {[1, 2, 3].map((priority) => (
                    <label key={priority}>
                        {priority + 1}순위
                        <select
                            className={styles.sortSelect}
                            value={props.sortBy[priority - 1]}
                            //onChange={(e) => onSort(e.target.value, priority - 1)}
                            >
                            {/* 옵션 배열의 객체들을 map으로 풂. */}
                            {optionsArr.map((item, index) => (
                                <option key={index} value={item.value}>{item.key}</option>
                            ))}
                        </select>
                    </label>
                ))}
            </div>

            <button className={styles.button} onClick={handleSort}>정렬하기</button>
        </div>
    );
};

export default Sort_UserList;
