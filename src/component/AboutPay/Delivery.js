import { useNavigate } from 'react-router-dom'
import styles from './Delivery.module.css'
export function Delivery(props){
  const navigate = useNavigate();
  function detailOrder(item){
    localStorage.setItem('newOrderData', JSON.stringify(item));
    navigate('/orderDetail');
  }
  return(
    <div className={styles.container}>
      {props.orderData ? props.orderData.map((item, key)=> 
      <div key={key} className={styles.deliveryList}>
        <div className={styles.orderDate}>
          <h4>{item.date} 주문</h4>
          <div onClick={()=>detailOrder(item)} className={styles.orderDetail}>
            <span>주문 상세보기</span> 
            <i className="far fa-chevron-right"></i>
          </div>
        </div>
        <div className={styles.deliveryStyle}>
          <div className={styles.deliveryNow}>
            <div className={styles.deliveryNowMenu}>
              <h5>{item.orderState === 0 ? '결제 대기' 
              : item.orderState === 1 ? '결제 완료'
              : item.orderState === 2 ? '배송 준비중'
              : item.orderState === 3 ? '배송 중'
              : item.orderState === 4 ? '배송 완료' 
              : '누락된 상품(고객센터 문의)' }</h5>
              <i style={{color: '#ccc'}} className="fas fa-trash-alt"></i>
            </div>
            <div className={styles.deliveryNowItem}>
              <img className={styles.img} src='../../image/logo.jpeg' alt="주문상품"/>
              <div className={styles.deliveryNowInformation}>
                <span>{item.productName}{item.optionSelected && `(${item.optionSelected})`}, {item.cnt}개 </span>
                <span>{item.discount 
                ? item.finprice - item.finprice/100*item.discount
                : item.finprice}원</span>
              </div>
            </div>
          </div>
          <div className={styles.deliveryMenu}>
            <button onClick={()=> console.log(props.orderData)} className={styles.button}>배송 조회</button>
            <button className={styles.button}>교환, 반품 신청</button>
          </div>
        </div>
      </div>
      )
    : 
    // 스켈레톤 처리
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
    }
    </div>
  )
}