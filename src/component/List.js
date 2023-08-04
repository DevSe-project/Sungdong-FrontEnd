import styles from './List.module.css'; 
import { useNavigate } from 'react-router-dom';
export function List(props){
  const navigate = useNavigate();
  return(
    <div>
      <div className={styles.headerTag}>
        <h2 className={styles.newItem}>신 상품</h2>
        <div className={styles.moreItem}>더보기 <i class='fas fa-angle-right'/>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.row}>
          {props.data.map((item,index)=>(
            <div onClick={()=>{navigate(`/detail/${item.id}`)}} key={index} className={styles.col}>            
              <div className={styles.frame}>
                <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" width="200px"/>
              </div>
              <div className={styles.product}>
                <p>{item.title}</p>
                <div className={styles.price}>
                  <h3>\{item.price}</h3>
                  <br/><hr/><br/>
                  구매평
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}