import { useNavigate } from 'react-router-dom';
import styles from './List.module.css'; 
import { Product } from './Product';
export function List(){
  const navigate = useNavigate();
  return(
    <div className={styles.head}>
      <div className={styles.headerTag}>
        <h2 className={styles.newItem}>추천 상품</h2>
        <div onClick={()=> navigate("/category")} className={styles.moreItem}>
          더보기&nbsp;<i className="far fa-chevron-right"/>
        </div>
      </div>
      <Product/>
    </div>
  )
}