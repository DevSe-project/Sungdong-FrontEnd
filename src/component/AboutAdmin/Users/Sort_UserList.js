import React from 'react';
import styles from './Sort_UserList.module.css';

export default function Sort_UserList() {
    return (
        <div>
            {/* Sorting options */}
            <button className={styles.button}>등급 정렬</button>
            <button className={styles.button}>기업명 정렬</button>
        </div>
    );
}
