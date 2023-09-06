import { useNavigate } from 'react-router-dom';
import styles from './OrderDetail.module.css'
import { TopBanner } from '../AboutHeader/TopBanner'
export function OrderDetail(props){
  const navigate = useNavigate();
  function gotoLink(){
    localStorage.removeItem('newOrderData');
    navigate("/");
  }
  const orderData = JSON.parse(localStorage.getItem('newOrderData'))
  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : orderData.order.name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : orderData.order.tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value :
      orderData.delivery.address 
      ? orderData.delivery.address.address 
      ? `${orderData.delivery.address.address.roadAddress} 
      (${orderData.delivery.address.address.bname}, 
        ${orderData.delivery.address.address.buildingName 
      ? orderData.delivery.address.address.buildingName
      : orderData.delivery.address.address.jibunAddress})
      ${orderData.delivery.address.addressDetail}` 
      : orderData.delivery.address.addressDetail
      : null
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : orderData.delivery.deliveryType,
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : orderData.delivery.deliveryMessage,
    },
  ];
  const payInputValue = [
    { 
      id : 0, 
      title : '결제 방법', 
      value : orderData.order.payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : orderData.order.moneyReceipt,
    },
    {
      id: 2,
      title : '명세서',
      value : orderData.order 
      && orderData.order.transAction
      ? orderData.order.transAction 
      : '발급안함'
    }
  ]
  return(
    <div>
    <TopBanner data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
    <div className={styles.container}>
      <h1 className={styles.getInformation}>받으시는 분 정보</h1>
      <form className={styles.form}>
        {/* 주문자 정보 */}
        {orderData ? orderInputValue.map((item, index) => 
        <div key={index} className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span>{item.value}</span>
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
      </form>

      <h1 className={styles.getInformation}>결제 수단</h1>
      <form className={styles.form}>
        {/* 결제 방식 정보 */}
        {orderData ? payInputValue.map((item, index) => 
        <div key={index} className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span> {item.value} </span>
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
        </div>}
      </form>
      <div>
        <button onClick={()=>gotoLink()} className={styles.button}>홈으로 가기</button>
      </div>
    </div>
  </div>
  )
}