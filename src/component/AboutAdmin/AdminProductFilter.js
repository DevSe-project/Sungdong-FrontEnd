import styles from './AdminProductFilter.module.css'
export function AdminProductFilter(){
  const filterList = [
    { label : '검색어', content : <input/>},
    { label : '검색어', content : <input/>},
  ]
  return(
    <div className={styles.main}>
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
    </div>
  )
}