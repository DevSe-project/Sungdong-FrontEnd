import styles from './AdminProductFilter.module.css'
export function AdminProductFilter(){
  const filterList = [
    { label : '검색어', content : <input/>},
    { label : '판매상태', content : <input/>},
    { label : '카테고리', content : <input/>},
    { label : '결제여부', content : <input/>},
    { label : '기간', content : <input/>},
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