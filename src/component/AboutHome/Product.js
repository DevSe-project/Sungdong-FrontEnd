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
              <p>{item.discount 
              ? <>
                <span style={{color: 'red', fontWeight: '750'}}>
                  ({item.discount}%)
                </span>
                &nbsp;{item.title}
                </>
              : `${item.title}`}</p>
              <div className={styles.price}>
                {item.discount
                ? <div style={{display: 'flex', alignItems: 'center', gap: '0.5em', justifyContent: 'flex-end'}}>
                  <p style={{textDecoration: "line-through", color: "lightgray", margin: '0'}}>
                    \{item.price}
                  </p>
                  <h3>
                    \{item.price-((item.price/100)*item.discount)}
                  </h3>
                </div>
                : <h3>\{item.price}</h3>
                }
                <br/><hr/><br/>
                구매평 {item.review ? item.review.length : 0}
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