import React from 'react';
import styles from './FiterSearch_User.module.css';
import { db } from '../../../firebase';


export default function FilterSearch_User() {
    return (
        <div>
            {/* Filter options */}
            <input className={styles.input} type="text" placeholder="기업명" />
            <input className={styles.input} type="text" placeholder="대표명" />
            <input className={styles.input} type="text" placeholder="사업자등록번호" />
            <select className={styles.select}>
                <option value="customerType">고객유형</option>
            </select>
            <select className={styles.select}>
                <option value="grade">등급</option>
            </select>
        </div>
    );
}
