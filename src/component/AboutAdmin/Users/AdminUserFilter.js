import React from 'react';
import styles from './AdminUserFilter.module.css';
import { useUserFilter, useUserFilterActions } from '../../../Store/DataStore';

export default function AdminUserFilter(props) {
    const userFilter = useUserFilter();
    const { setUserFilter,resetUserFilter } = useUserFilterActions();

    return (
        <div className={styles.body}>
            {/* TITLE */}
            <div className={styles.title}>
                검색필터
            </div>

            {/* FILTER OPTIONS */}
            <div className={styles.searchRow}>
                <div className={styles.searchGroup}>
                    <label htmlFor="cor_corName">기업명</label>
                    <input
                        id="cor_corName"
                        className={styles.input}
                        type="text"
                        placeholder="기업명"
                        value={userFilter.cor_corName}
                        onChange={(e)=>setUserFilter("cor_corName", e.target.value)}
                    />
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="cor_ceoName">대표명</label>
                    <input
                        id="cor_ceoName"
                        className={styles.input}
                        type="text"
                        placeholder="대표명"
                        value={userFilter.cor_ceoName}
                        onChange={(e)=>setUserFilter("cor_ceoName", e.target.value)}
                    />
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="cor_num">사업자등록번호</label>
                    <input
                        id="cor_num"
                        className={styles.input}
                        type="text"
                        placeholder="사업자등록번호"
                        value={userFilter.cor_num}
                        onChange={(e)=>setUserFilter("cor_num", e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.searchRow}>
                <div className={styles.searchGroup}>
                    <label htmlFor="userType">고객유형</label>
                    <select 
                        className={styles.select} id="userType_id"
                        value={userFilter.userType_id || ""}
                        onChange={(e)=>setUserFilter("userType_id", e.target.value)}
                    >
                        <option value="">고객유형</option>
                        <option value={1}>실사용자</option>
                        <option value={2}>납품업자</option>
                    </select>
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="grade">등급</label>
                    <select 
                        className={styles.select} id="grade"
                        value={userFilter.grade || ""}
                        onChange={(e)=>setUserFilter("grade", e.target.value)}
                    >
                        <option value="">등급</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
            </div>

            {/* Button */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '0.5em'}}>
                <button type='reset' className={styles.buttonReset} onClick={()=>resetUserFilter()}>초기화</button>
                <button className={styles.button} onClick={()=>props.onFiltering()}>검색하기</button>
            </div>
        </div>
    );
}
