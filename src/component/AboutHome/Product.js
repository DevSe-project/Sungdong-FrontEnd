import styles from './Product.module.css'; 
import { useNavigate } from 'react-router-dom';
export function Product(props){
  const navigate = useNavigate();
  return(
  <div className={styles.main}>
    <div className={styles.container}>
      <div className={styles.row}>
        {props.data ? props.data.map((item,index)=>(
          <div onClick={()=>{navigate(`/detail/${item.id}`)}} key={index} className={styles.col}>            
            <div className={styles.frame}>
              <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="상품 이미지" width="200px"/>
            </div>
            <div className={styles.product}>
                {item.title}
              <div className={styles.price}>
                {item.discount ?
                  <h3>
                    \{item.price-((item.price/100)*item.discount)}
                  </h3>
                : <h3>\{item.price}</h3>
                }
                <br/><hr/><br/>
                <span>{item.category && `${item.category.main}`}</span>
              </div>
            </div>
          </div>
        ))
        : <>
          {/* 스켈레톤 레이아웃 */}
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
  </div>
  )
}