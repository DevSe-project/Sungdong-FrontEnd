import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Order.module.css'
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';


export function Order(props){
  const { fetchGetServer} = useFetch();
  const navigate = useNavigate();
  const location = useLocation();

  //주문 데이터 fetch
  const fetchOrderData = async() => {
    return fetchGetServer(`/order/findOne`, 1);
};

  const { isLoading, isError, error, data:orderData } = useQuery({queryKey:['orderDetail'], queryFn: ()=> fetchOrderData()});

  useEffect(() => {
    if (
      location.pathname !== '/orderStep/order'
    ) {
      props.setActiveTab(1);
    }
  }, [location, navigate])
  
  function gotoLink(){
    if(props.activeTab===4) {
      props.setActiveTab(1);
      navigate("/");
    }
  }
  // 주소창으로 접근 등 잘못된 접근 시 경고창 표시 후 홈으로 이동 
  useEffect(()=>{
    if (props.activeTab !== 4) {
      alert("잘못된 접근입니다.");
      props.setActiveTab(1);
      navigate("/");
    }
  }, [navigate, props])


  const orderInputValue = [
    { 
      id : 0, 
      title : '성함', 
      value : orderData?.order_name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : orderData?.order_tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      `${orderData?.roadAddress} 
      (${orderData?.bname}, 
        ${orderData?.buildingName 
      ? orderData?.buildingName
      : orderData?.jibunAddress})
      ${orderData?.addressDetail}` 
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : 
      orderData?.deliveryType &&
      orderData?.deliveryType === '화물'

      ? orderData?.delivery_selectedCor === 'kr.daesin' 
      ? `${orderData && orderData?.deliveryType} (배송 업체 : 대신화물)` 
      : `${orderData && orderData?.deliveryType} (배송 업체 : 경동화물)`

      : orderData?.deliveryType === '성동택배'

      ? `${orderData?.deliveryType} 
      (배송 예정일 : ${orderData && new Date(orderData?.delivery_date).toLocaleDateString()})`
      : orderData?.deliveryType
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : orderData?.delivery_message,
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : orderData?.smtMessage,
    },
  ]

  const payInputValue = [

    { 
      id : 0, 
      title : '결제 방법', 
      value : orderData?.order_payRoute === '무통장입금' ? `${orderData?.order_payRoute} | 입금계좌 : ~~ | 입금자명 : ${orderData?.order_payName}` : orderData?.order_payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : orderData?.order_moneyReceipt,
    },
    {
      id: 2,
      title : '명세서',
      value : orderData?.printFax === true 
      ? `명세서 실물 발부 + 출력 (FAX : ${orderData?.order_faxNum})`
      : `명세서 실물 발부`
    }
  ];

  if(isLoading){
    return <p>Loading...</p>
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }
  return(
    <div className={styles.container}>
      <h1 className={styles.getInformation}>받으시는 분 정보</h1>
      <form className={styles.form}>
        {/* 주문자 정보 */}
        {props.activeTab===4 && orderData ? orderInputValue.map((item, index) => 
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
      <p>로딩중</p>
      }
      </form>

      <h1 className={styles.getInformation}>결제 수단</h1>
      <form className={styles.form}>
        {/* 결제 방식 정보 */}
        {props.activeTab===4 && orderData ? payInputValue.map((item, index) => 
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
      <p>로딩중</p>
      }
      </form>
      <div>
        <button onClick={()=>gotoLink()} className={styles.button}>홈으로 가기</button>
      </div>
    </div>
  )
}