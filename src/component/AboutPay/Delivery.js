import { useNavigate } from 'react-router-dom'
import styles from './Delivery.module.css'
import { useEffect, useState } from 'react';
import { useDataActions, useOrderData } from '../../Store/DataStore';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery } from '@tanstack/react-query';
import { handleForbiddenError, handleOtherErrors, handleUnauthorizedError } from '../../customFn/ErrorHandling';

export function Delivery(props){

  const {setDetailData} = useDataActions();

  //주문 데이터 fetch 
  const fetchOrderData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/order/list", 
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
  }

  //상품 주문 정보 요청 함수
  const orderRequest = async (order_id) => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/order/findSelectOrderList", 
        JSON.stringify({order_id: order_id}),
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
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

  const { isLoading, isError, error, data:order } = useQuery({queryKey:['order'], queryFn: ()=> fetchOrderData()});

  const { mutate:orderListMutation } = useMutation({mutationFn: orderRequest})


  const navigate = useNavigate();

  function handleDeliveryAPI(item, deliveryNum){
    if(item.orderState === 3){
      switch(item.delivery.deliveryType){
        case '일반택배':
          window.open(`https://tracker.delivery/#/kr.cjlogistics/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        case '화물':
          window.open(`https://tracker.delivery/#/${item.delivery_selectedCor}/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        default : 
          alert("직접 수령이나 성동 택배는 조회하실 수 없습니다.");
          break;
      } 
    } else {
      alert("배송 준비 중일때는 조회하실 수 없습니다.")
    }
  }
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);


  function detailOrder(item){
    orderListMutation(item.order_id,{
      onSuccess: (data) => {
        console.log(data);
        const orderdata = data.data;
        setDetailData(...orderdata);
        navigate("/orderDetail");
      },
      onError: (error) => {
        // 상품 삭제 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 삭제 처리하는 중 오류가 발생했습니다.', error);
      }
    })
  }

  if(isLoading){
    return <p>Loading..</p>;
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }


  return(
    <div className={styles.container}>
      {props.resultSearch &&
      <h3 style={{margin: '1em'}}>
      "{props.resultSearch}" 에 대해
      {/* <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
      이 검색 되었습니다. */}
      </h3>}
      {order ?
      order.result.map((item, key)=> 
      <div key={key} className={styles.deliveryList}>
        <div className={styles.orderDate}>
          <h4 style={{fontWeight: '850'}}>{new Date(item.order_date).toLocaleDateString()} 주문</h4>
          <div onClick={()=>detailOrder(item)} className={styles.orderDetail}>
            <span style={{fontWeight: '450'}} onClick={()=> detailOrder(item)}>주문 상세보기</span> 
            <i className="far fa-chevron-right"></i>
          </div>
        </div>
        <div className={styles.deliveryStyle}> 
          <div className={styles.deliveryNow}>
            <div className={styles.deliveryNowMenu}>
              <h5 style={{fontWeight: '650'}}>
              {item.orderState === 0 ? '결제 대기' 
              : item.orderState === 1 ? '결제 완료'
              : item.orderState === 2 ? '배송 준비중'
              : item.orderState === 3 ? '배송 중'
              : item.orderState === 4 ? '배송 완료' 
              : '누락된 상품(고객센터 문의)' }
              <p>배송 : {item.deliveryType}{item.delivery_selectedCor && item.delivery_selectedCor === "kr.daesin" ? `( 대신 화물 )` : item.delivery_selectedCor === "kr.kdexp" ? `(경동 화물)` : item.deliveryType === "일반택배" && `( CJ대한통운 )`}</p>
              <p style={{color: 'orangered', fontWeight: '550'}}>{item.delivery_date && `🚚 배송 예정 : ${new Date(item.delivery_date).toLocaleDateString()}`}</p>
              </h5>
              <i style={{color: '#ccc'}} className="fas fa-trash-alt"></i>
            </div>
            {item.products.map((product,key) => 
            <div key={key} className={styles.deliveryNowItem}>
              <img className={styles.img} src={product.product_image_original} alt="주문상품"/>
              <div className={styles.deliveryNowInformation}>
                <span style={{fontWeight: '450'}}>{product.product_title}, {product.order_cnt}개 </span>
                <span>규격 : {product.product_spec && product.product_spec}</span>
                <span>옵션 : {product.selectedOption && product.selectedOption}</span>
                <span style={{fontWeight: '650'}}>{parseInt(product.order_productPrice).toLocaleString()}원</span>
              </div>
            </div>
            )}
          </div>
          <div className={styles.deliveryMenu}>
            <button 
          onClick={() => {
            handleDeliveryAPI(item, item.delivery_num && item.delivery_num)
          }}
            className={styles.button}>배송 조회</button>
            {item.orderState < 4 
            ?
            <button className={styles.button}>주문 취소</button>
            :
            <button
            onClick={()=>navigate("/return/request")} 
            className={styles.button}
            >교환, 반품 신청</button>
            }
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
    <div className={styles.buttonContainer}>
      {/* 이전 페이지 */}
      <button
        className={styles.pageButton} 
        onClick={()=> {
          if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
          } else {
            alert("해당 페이지가 가장 첫 페이지 입니다.")
      }}}>
      <i className="far fa-angle-left"/>
      </button>
      <div className={styles.pageButton}>
        {currentPage}
      </div>
        {/* 다음 페이지 */}
      <button
      className={styles.pageButton}
      onClick={()=> {
        if(order.length > 5){
          setCurrentPage(currentPage + 1)
        } else {
          alert("다음 페이지가 없습니다.")
        }}}>
          <i className="far fa-angle-right"/>
      </button>
    </div>
  </div>
  )
}