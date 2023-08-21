import { useNavigate } from 'react-router-dom';
import styles from './Order.module.css'
export function Order(props){
  const navigate = useNavigate();
  function gotoLink(){
    if(props.activeTab===4) {
      props.setActiveTab(1);
      navigate("/");
    }
  }
  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : props.orderData.order.name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : props.orderData.order.tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      props.orderData.delivery.address.address 
      ?
      `${props.orderData.delivery.address.address.roadAddress} 
      (${props.orderData.delivery.address.address.bname}, 
        ${props.orderData.delivery.address.address.buildingName 
      ? props.orderData.delivery.address.address.buildingName
      : props.orderData.delivery.address.address.jibunAddress})
      ${props.orderData.delivery.address.addressDetail}` 
      : props.orderData.delivery.address.addressDetail,
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : props.orderData.delivery.deliveryType,
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : props.orderData.delivery.deliveryMessage,
    },
  ];
  const payInputValue = [
    { 
      id : 0, 
      title : '결제 방법', 
      value : props.orderData.order.payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : props.orderData.order.moneyReceipt,
    },
  ]
  return(
    <div className={styles.container}>
      <h1 className={styles.getInformation}>받으시는 분 정보</h1>
      <form className={styles.form}>
        {/* 주문자 정보 */}
        {props.orderData ? orderInputValue.map((item, index) => 
        <div key={index} className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span>{item.value}</span>
          </div>
        </div>
        )
        : `로딩중..`}
      </form>

      <h1 className={styles.getInformation}>결제 수단</h1>
      <form className={styles.form}>
        {/* 결제 방식 정보 */}
        {props.orderData ? payInputValue.map((item, index) => 
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span> {item.value} </span>
          </div>
        </div>
        )
      : `로딩중...`}
      </form>
      <div>
        <button onClick={()=>gotoLink()} className={styles.button}>홈으로 가기</button>
      </div>
    </div>
  )
}