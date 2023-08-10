import styles from './List.module.css'; 
import { Product } from './Product';
export function List(props){
  return(
    <div>
      <div className={styles.headerTag}>
        <h2 className={styles.newItem}>신 상품</h2>
        <div className={styles.moreItem}>
          더보기&nbsp;<i className="far fa-chevron-right"/>
        </div>
      </div>
      <Product data={props.data}/>
    </div>
  )
}