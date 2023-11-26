import React from 'react';
import styles from './Sort_UserList.module.css';

const Sort_UserList = (props) => {

    const handleSort = () => {
        props.onSort();
    };

    // 추가 예정 기능 - 정렬이 2개 이상 선택되면 경고문구 표시

    return (
        <div className={styles.body}>

            <div className={styles.title}>정렬 우선순위</div>

            <div className={styles.sortItems}>
                {[1, 2, 3].map((priority) => (
                    <label key={priority}>
                        {priority}순위
                        <select 
                            className={styles.sortSelect}
                            value={props.sortBy[priority - 1]}
                            onChange={(e) => onSort(e.target.value, priority - 1)}>
                            <option value="usertype">구분</option>
                            <option value="bizname">업체명ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</option>
                            <option value="grade">등급</option>
                        </select>
                    </label>
                ))}

                {/* 다음 미팅: 고객 리스트 중 하나를 클릭하면 고객 상세 정보를 볼 수 있다. 
                        리스트에서 바로 보이도록 하고 싶은 데이터가 무엇이 있는지 취합하고, 
                        이 데이터를 option으로 추가 예정 */}

            </div>

            <button className={styles.button} onClick={handleSort}>정렬하기</button>

        </div>
    );
};

export default Sort_UserList;
