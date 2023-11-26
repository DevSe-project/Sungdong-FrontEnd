import React from 'react';
import styles from './FiterSearch_User.module.css';

export default function FilterSearch_User() {
    return (
        <div className={styles.body}>
            {/* TITLE */}
            <div className={styles.title}>
                검색필터
            </div>

            {/* FILTER OPTIONS */}
            <div className={styles.searchRow}>
                <div className={styles.searchGroup}>
                    <label htmlFor="bizName">기업명</label>
                    <input
                        id="bizname"
                        className={styles.input}
                        type="text"
                        placeholder="기업명"
                    />
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="ceoName">대표명</label>
                    <input
                        id="ceoName"
                        className={styles.input}
                        type="text"
                        placeholder="대표명"
                    />
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="bizNum">사업자등록번호</label>
                    <input
                        id="bizNum"
                        className={styles.input}
                        type="text"
                        placeholder="사업자등록번호"
                    />
                </div>
            </div>

            <div className={styles.searchRow}>
                <div className={styles.searchGroup}>
                    <label htmlFor="customerType">고객유형</label>
                    <select className={styles.select} id="customerType">
                        <option value="customerType">고객유형</option>
                    </select>
                </div>

                <div className={styles.searchGroup}>
                    <label htmlFor="grade">등급</label>
                    <select className={styles.select} id="grade">
                        <option value="grade">등급</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
