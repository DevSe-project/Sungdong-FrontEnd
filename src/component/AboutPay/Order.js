import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Order.module.css'
import { useEffect } from 'react';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useQuery } from '@tanstack/react-query';
import { useListActions, useOrderList } from '../../Store/DataStore';
import { handleForbiddenError, handleOtherErrors, handleUnauthorizedError } from '../../customFn/ErrorHandling';


export function Order(props){
  const navigate = useNavigate();
  const location = useLocation();

  //주문 데이터 fetch
  const fetchOrderData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/order/findOne", 
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      return response.data;
    } catch (error) {
      // 서버 응답이 실패인 경우
      if (error.response && error.response.status === 401) {
        // 서버가 401 UnAuthorazation를 반환한 경우
        handleUnauthorizedError(error.response.data.message);
        return {};
    } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        return {};
    } else {
        handleOtherErrors('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
        return {};
    }
  }
};

  const { isLoading, isError, error, data:orderData } = useQuery({queryKey:['orderDetail'], queryFn: ()=> fetchOrderData()});


  console.log(orderData)
  useEffect(() => {
    if (
      location.pathname !== '/basket/order'
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
      value : orderData?.data[0].order_name,
    },
    { 
      id : 1, 
      title : '전화번호', 
      value : orderData?.data[0].order_tel,
    },
    { 
      id : 2, 
      title : '주소', 
      value : 
      `${orderData?.data[0]?.roadAddress} 
      (${orderData?.data[0]?.bname}, 
        ${orderData?.data[0]?.buildingName 
      ? orderData?.data[0]?.buildingName
      : orderData?.data[0]?.jibunAddress})
      ${orderData?.data[0]?.addressDetail}` 
    },
    { 
      id : 3, 
      title : '배송방식', 
      value : 
      orderData?.data[0]?.deliveryType &&
      orderData?.data[0]?.deliveryType === '화물'

      ? orderData?.data[0]?.delivery_selectedCor === 'kr.daesin' 
      ? `${orderData?.data[0] && orderData?.data[0]?.deliveryType} (배송 업체 : 대신화물)` 
      : `${orderData?.data[0] && orderData?.data[0]?.deliveryType} (배송 업체 : 경동화물)`

      : orderData?.data[0]?.deliveryType === '성동택배'

      ? `${orderData?.data[0]?.deliveryType} 
      (배송 예정일 : ${orderData?.data[0] && orderData?.data[0]?.delivery_date})`
      : orderData?.data[0]?.deliveryType
    },
    { 
      id : 4, 
      title : '배송 메세지', 
      value : orderData?.data[0]?.delivery_message,
    },
    { 
      id : 5, 
      title : '성동 메세지', 
      value : orderData?.data[0]?.smtMessage,
    },
  ];
  const payInputValue = [
    { 
      id : 0, 
      title : '결제 방법', 
      value : orderData?.data[0]?.order_payRoute,
    },
    {
      id : 1, 
      title : '증빙 서류 발급', 
      value : orderData?.data[0]?.order_moneyReceipt,
    },
    {
      id: 2,
      title : '명세서',
      value : orderData?.data[0]?.printFax === true 
      ? `명세서 실물 발부 + 출력 (FAX : ${orderData?.data[0]?.order_faxNum})`
      : `명세서 실물 발부`
    }
  ]
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