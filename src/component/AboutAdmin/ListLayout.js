import React from 'react';
import styles from './ListLayout.module.css';

const ListLayout = ({ title, items }) => {
  return (
    <div className={styles.listContainer}>
      <h2>{title}</h2>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>{index + 1} - {item.code}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListLayout;
