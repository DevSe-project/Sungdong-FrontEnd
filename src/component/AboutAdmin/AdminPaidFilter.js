import styles from './AdminPaidFilter.module.css';
export function AdminPaidFilter(){
  const filterList = [
    { label : '조회기간', content : 1},
    { label : '주문상태', content : 2},
    { label : '배송방법', content : 3},
    { label : '상세조건', content : 4},
  ]
  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        {filterList.map((item, index) => (
        <div className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset'/>
        </div>
      </form>
    </div>
  )
}