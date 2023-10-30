import React, { useState } from 'react';
import styles from './Notice.module.css';
import { NoticeObj } from '../Data/NoticeObj';

export function Notice() {
  const [list, setList] = useState(NoticeObj);

  return (
    <div className={styles.noticeContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>공지사항</h1>
        <div className={styles.searchContainer}>
          <label className={styles.search_label} htmlFor="search">검색:</label>
          <input
            className={styles.search_input}
            type="text"
            id="search"
            placeholder="검색어를 입력하세요"
          />
        </div>
      </div>
      <div className={styles.listContainer}>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className={styles.row}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.writer}</td>
                <td>{item.date}</td>
                <td>{item.view}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
