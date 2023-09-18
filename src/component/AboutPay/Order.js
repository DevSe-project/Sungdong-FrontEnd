import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Order.module.css'
import { useEffect, useState } from 'react';
export function Order(props){
  const [orderProductData, setOrderProductData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname !== '/basket/order'
    ) {
      props.setActiveTab(1);
      sessionStorage.removeItem('newOrderData');
    }
  }, [location, navigate])
  
  function gotoLink(){
    if(props.activeTab===4) {
      props.setActiveTab(1);
      sessionStorage.removeItem('newOrderData');
      navigate("/");
    }
  }
  // 주소창으로 접근 등 잘못된 접근 시 경고창 표시 후 홈으로 이동 
  useEffect(()=>{
    if (props.activeTab !== 4) {
      alert("잘못된 접근입니다.");
      props.setActiveTab(1);
      navigate("/");
    } else {
      const parsingData = JSON.parse(sessionStorage.getItem('newOrderData'));
      setOrderProductData(parsingData[0]); 
    }
  }, [navigate, props])


  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : orderProductData.order && orderProductData.order.name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : orderProductData.order && orderProductData.order.tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      orderProductData.delivery &&
      orderProductData.delivery.address &&
      orderProductData.delivery.address.address 
      ?
      `${orderProductData.delivery.address.address.roadAddress} 
      (${orderProductData.delivery.address.address.bname}, 
        ${orderProductData.delivery.address.address.buildingName 
      ? orderProductData.delivery.address.address.buildingName
      : orderProductData.delivery.address.address.jibunAddress})
      ${orderProductData.delivery.address.addressDetail}` 
      : '',
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : orderProductData.delivery &&
      orderProductData.delivery.deliveryType &&
      orderProductData.delivery.deliveryType === '화물'

      ? orderProductData.delivery.deliverySelect === 'kr.daesin' 
      ? `${orderProductData.delivery && orderProductData.delivery.deliveryType} (배송 업체 : 대신화물)` 
      : `${orderProductData.delivery && orderProductData.delivery.deliveryType} (배송 업체 : 경동화물)`

      : orderProductData.delivery &&
      orderProductData.delivery.deliveryType &&
      orderProductData.delivery.deliveryType === '성동택배'

      ? `${orderProductData.delivery && orderProductData.delivery.deliveryType} 
      (배송 예정일 : ${orderProductData.delivery && orderProductData.delivery.deliveryDate})`
      : orderProductData.delivery && orderProductData.delivery.deliveryType
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : orderProductData.delivery && orderProductData.delivery.deliveryMessage,
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : orderProductData.order && orderProductData.order.smtMessage ? orderProductData.order.smtMessage : '없음',
    },
  ];
  const payInputValue = [
    { 
      id : 0, 
      title : '결제 방법', 
      value : orderProductData.order && orderProductData.order.payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : orderProductData.order && orderProductData.order.moneyReceipt,
    },
    {
      id: 2,
      title : '명세서',
      value : orderProductData.order
      && orderProductData.order.moneyReceipt 
      && orderProductData.order.transAction
      ? orderProductData.order.transAction === '명세서출력'
      ? `${orderProductData.order.transAction} (Fax 번호 : ${orderProductData.order.fax})`
      : orderProductData.order.transAction
      : '발행안함'
    }
  ]
  return(
    <div className={styles.container}>
      <h1 className={styles.getInformation}>받으시는 분 정보</h1>
      <form className={styles.form}>
        {/* 주문자 정보 */}
        {props.activeTab===4 && orderProductData ? orderInputValue.map((item, index) => 
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
        {props.activeTab===4 && orderProductData ? payInputValue.map((item, index) => 
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
  )
}