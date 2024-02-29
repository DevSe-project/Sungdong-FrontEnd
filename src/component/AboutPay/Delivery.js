import { useNavigate } from 'react-router-dom'
import styles from './Delivery.module.css'
import { useEffect, useState } from 'react';
import { useDataActions, useModalActions, useModalState } from '../../store/DataStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination'
import axios from '../../axios';
export function Delivery(props) {

  const { fetchServer, fetchGetServer } = useFetch();
  const { setDetailData } = useDataActions();
  const {modalName} = useModalState();
  const {selectedModalOpen} = useModalActions();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryClient = useQueryClient();

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/order/list', pageNumber);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['order'], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //주문 데이터 fetch 
  const fetchOrderData = async () => {
    const data = await fetchGetServer('/order/list', 1);

    // 게시물과 페이지 정보를 받아올 때 마다 업데이트
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  }

  //처음 마운트 될때 페이지 설정.
  useEffect(() => {
    const fetchOrderData = async () => {
      const data = await fetchGetServer('/order/list', 1);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    };

    fetchOrderData();
  }, [])

  //상품 주문 정보 요청 함수
  const orderRequest = async (order_id) => {
    return fetchServer(order_id, 'post', '/order/findSelectOrderList', 1);
  };

  const { isLoading, isError, error, data: order } = useQuery({ queryKey: ['order'], queryFn: () => fetchOrderData() });

  const { mutate: orderListMutation } = useMutation({ mutationFn: orderRequest })


  const navigate = useNavigate();

  function handleDeliveryAPI(item, deliveryNum) {
    if (item.orderState === 3) {
      switch (item.delivery.deliveryType) {
        case '일반택배':
          window.open(`https://tracker.delivery/#/kr.cjlogistics/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        case '화물':
          window.open(`https://tracker.delivery/#/${item.delivery_selectedCor}/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        default:
          alert("직접 수령이나 성동 택배는 조회하실 수 없습니다.");
          break;
      }
    } else {
      alert("배송 준비 중일때는 조회하실 수 없습니다.")
    }
  }

  function detailOrder(item) {
    const jsonOrder = {
      order_id: item.order_id
    }
    orderListMutation(jsonOrder, {
      onSuccess: (data) => {
        const orderdata = data.data;
        setDetailData(...orderdata);
        navigate("/orderDetail");
      },
      onError: (error) => {
        // 상품 삭제 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 불러오는 중 오류가 발생했습니다.', error);
      }
    })
  }

    //-------------------상품삭제--------------------

    const fetchDeletedProducts = async (orderId) => {
      try {
        const response = await axios.delete(`/order/delete/${orderId}`,
        )
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  
    // 상품 삭제를 처리하는 뮤테이션
    const { mutate: deleteProductMutation } = useMutation({ mutationFn: fetchDeletedProducts })

  function handleCancelOrder(item){
    //결제 상태가 미결제 상태면
    if(item.orderState === 0){
      const isConfirmed = window.confirm('정말로 주문을 취소하시겠습니까?');
      if (isConfirmed) {
        deleteProductMutation(item.order_id, {
          onSuccess: (data) => {
            alert(data.message);
            // 상품 삭제 성공 시 상품 목록을 다시 불러옴
            queryClient.invalidateQueries(['order']);
            window.location.reload();
          },
          onError: (error) => {
            // 상품 삭제 실패 시, 에러 처리를 수행합니다.
            alert(error.message);
          },
        });
      }
    }
    //결제 상태가 결제 완료, 배송 준비중 이면 
    else {
      
    }
  }

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.container}>
      {props.resultSearch &&
        <h3 style={{ margin: '1em' }}>
          "{props.resultSearch}" 에 대해
          {/* <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
      이 검색 되었습니다. */}
        </h3>}
      {order ?
        order.map((item, key) =>
          <div key={key} className={styles.deliveryList}>
            <div className={styles.orderDate}>
              <h4 style={{ fontWeight: '850' }}>{new Date(item.order_date).toLocaleDateString()} 주문</h4>
              <div onClick={() => detailOrder(item)} className={styles.orderDetail}>
                <span style={{ fontWeight: '450' }} onClick={() => detailOrder(item)}>주문 상세보기</span>
                <i className="far fa-chevron-right"></i>
              </div>
            </div>
            <div className={styles.deliveryStyle}>
              <div className={styles.deliveryNow}>
                <div className={styles.deliveryNowMenu}>
                  <h5 style={{ fontWeight: '650' }}>
                    {item.orderState === 0 ? '결제 대기'
                      : item.orderState === 1 ? '결제 완료'
                        : item.orderState === 2 ? '배송 준비중'
                          : item.orderState === 3 ? '배송 중'
                            : item.orderState === 4 ? '배송 완료'
                              : item.orderState === 5 ? '취소'
                              : '누락된 상품(고객센터 문의)'}
                    <p>배송 : {item.deliveryType}{item.delivery_selectedCor && item.delivery_selectedCor === "kr.daesin" ? `( 대신 화물 )` : item.delivery_selectedCor === "kr.kdexp" ? `(경동 화물)` : item.deliveryType === "일반택배" && `( CJ대한통운 )`}</p>
                    <p style={{ color: 'orangered', fontWeight: '550' }}>{item.delivery_date && `🚚 배송 예정 : ${new Date(item.delivery_date).toLocaleDateString()}`}</p>
                  </h5>
                  <i style={{ color: '#ccc' }} className="fas fa-trash-alt"></i>
                </div>
                {item.products && JSON.parse('[' + item.products + ']').map((product, key) =>
                  <div key={key} className={styles.deliveryNowItem}>
                    <img className={styles.img} src={product.product_image_original} alt="주문상품" />
                    <div className={styles.deliveryNowInformation}>
                      <span className={styles.itemTitle}>{product.product_title}, {product.order_cnt}개 </span>
                      <span className={styles.itemOptions}>규격 : {product.product_spec && product.product_spec}</span>
                      <span className={styles.itemOptions}>옵션 : {product.selectedOption ? product.selectedOption : '없음'}</span>
                      <span className={styles.itemOptions}>공급단가 : {(product.order_productPrice/product.order_cnt).toLocaleString()}원</span>
                      <span className={styles.itemTitle}>{parseInt(product.order_productPrice).toLocaleString()}원</span>
                    </div>
                  </div>
                )}
                <div className={styles.itemTitle} style={{color: '#CC0000', marginTop: '1em'}}>총 주문액 : {parseInt(item.order_payAmount).toLocaleString()}원</div>
              </div>
              <div className={styles.deliveryMenu}>
                {item.orderState < 5 &&
                <button
                  onClick={() => {
                    handleDeliveryAPI(item, item.delivery_num && item.delivery_num)
                  }}
                  className={styles.button}>배송 조회</button>
                }
                {item.orderState < 3
                  ?
                  <button className={styles.button} onClick={()=> handleCancelOrder(item)}>주문 취소</button>
                  :
                  item.orderState === 4 
                  &&
                  <button
                    onClick={() => navigate("/return/request")}
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}