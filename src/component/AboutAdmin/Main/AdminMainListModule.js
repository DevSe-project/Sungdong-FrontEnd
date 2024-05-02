import styles from './Module.module.css';
export function AdminMainListModule({icon, firstName, secondName, thirdName, first, second, third}) {
  return (
    <div className={styles.container}>
      {/* 아이콘 삽입부분 */}
      <div className={styles.icon}>
        {icon}
      </div>
      <div className={styles.list}>
        <div className={styles.listItem}>
          <div>
            <h4>{firstName}</h4>
          </div>
          <div>
            <span className={styles.colorCnt}>{first}</span>
            건
          </div>
        </div>
        <div className={styles.listItem}>
          <div>
            <h4>{secondName}</h4>
          </div>          
          <div>
            <span className={styles.colorCnt}>{second}</span>
            건
          </div>
        </div>
        <div className={styles.listItem}>
          <div>
            <h4>{thirdName}</h4>
          </div>             
          <div>
            <span className={styles.colorCnt}>{third}</span>
            건
          </div>
        </div>
      </div>
    </div>
  );
}
