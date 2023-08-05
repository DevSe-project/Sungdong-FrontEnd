import styles from './Product.module.css'; 
import { useNavigate } from 'react-router-dom';
export function Product(props){
  const navigate = useNavigate();
  return(
  <div className={styles.container}>
    <div className={styles.row}>
      {props.data ? props.data.map((item,index)=>(
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
      ))
      : <>
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
            &nbsp;
          </div>
        </div>
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
            &nbsp;
          </div>
        </div>
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
            &nbsp;
          </div>
        </div>
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
            &nbsp;
          </div>
        </div>
        <div className={styles.colskeleton}>
          <div className={styles.frameskeleton}>
          &nbsp;
          </div>
          <div className={styles.nameskeleton}>
            &nbsp;
          </div>
          <div className={styles.priceskeleton}>
            &nbsp;
          </div>
        </div>
      </>
      }
    </div>
  </div>
  )
}