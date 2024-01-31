import { useEffect, useState } from 'react';
import styles from './Basket.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCartList, useDataActions, useListActions, useOrderActions, useOrderData, useOrderList } from '../../Store/DataStore';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useErrorHandling } from '../../customFn/ErrorHandling';
import Cookies from 'js-cookie';
import { StepModule } from '../AboutPay/StepModule';
export function Basket(props){
  const {handleForbiddenError, handleOtherErrors, handleUnauthorizedError} = useErrorHandling();

  //장바구니 데이터 fetch
  const fetchCartData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/cart/list", 
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      return response.data.data;
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


  // 장바구니 데이터 불러오기
  const { isLoading, isError, error, data:basketList } = useQuery({queryKey:['cart'], queryFn: ()=> fetchCartData()});

  const cartList = useCartList();
  const {setCartList, setCartCntUp, setCartCntDown, setCartCnt, resetCartList, setOrderList} = useListActions();

  const orderList = useOrderList();

  const {setUserData} = useDataActions();
  const {resetOrderInfo, setOrderInformation} = useOrderActions();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // 배송가
  const delivery = 3000;

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  const location = useLocation();

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  //장바구니 데이터 fetch
  const orderToFetch = async(product) => {
    try{
    const token = GetCookie('jwt_token');
    const response = await axios.post("/order/write",
        JSON.stringify(
        product
        ),
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



  // 장바구니 탭 - 결제 탭에서 뒤로가기 시 뒤로가기 방지 후 장바구니 탭으로 이동
  useEffect(() => {
    const handleBack = (e) => {
      e.preventDefault();
      const isConfirmed = 
      window.confirm(`주문서 작성 및 결제 중 뒤로가기 시 결제 정보가 초기화 됩니다. \n계속하시겠습니까?`)
      if(isConfirmed){
        props.setActiveTab(1);
        setSelectedItems([]);
        setSelectAll(false);
        navigate('/basket');
      }
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleBack);

    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, [props, navigate]);

  useEffect(() => {
    if (
      location.pathname !== '/basket/order' &&
      location.pathname !== '/basket/receipt' &&
      location.pathname !== '/basket/pay'
    ) {
      // 필요한 상태 초기화 로직을 여기에 추가
      setSelectedItems([]);
      setSelectAll(false);
      props.setActiveTab(1);
      setOrderList([]);
    }
  }, [location]);

  useEffect(()=> {
    function fetchData(){
      if ((basketList && cartList.length === 0) || (basketList && basketList.map(item => cartList.length > 0 && cartList.map(cart => item !== cart)))) {
        resetCartList();
        setCartList(basketList);
      }
    };
  
    fetchData();
  }, [basketList])

  //----------------------체크박스------------------------
  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = basketList && cartList.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  console.log(orderList)

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.cart_product_id === product.cart_product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.cart_product_id !== product.cart_product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if(selectedItems.length + 1 === cartList.length){
        setSelectAll(true);
      }
    }
  };

  //-------------------상품삭제--------------------

  const fetchDeletedProducts = async(productId) => {
    try {
      const response = await axios.delete(`/cart/delete/${productId}`,
      )
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 상품 삭제를 처리하는 뮤테이션
  const {mutate:deleteProductMutation} = useMutation({mutationFn: fetchDeletedProducts})

  //상품 목록 삭제 함수
  const deletedList = () => {
    const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
    if(isConfirmed){
      const itemsId = selectedItems.map(item => item.cart_product_id)
      deleteProductMutation(itemsId,{
        onSuccess: (data) => {
          alert(data.message);
          // 상품 삭제 성공 시 상품 목록을 다시 불러옴
          queryClient.invalidateQueries(['cart']);
        },
        onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          console.error('상품을 삭제 처리하는 중 오류가 발생했습니다.', error);
        },
      });
    }
  };
// --------- 수량 변경 부분 ----------
  
  // 수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e, prevItem) => {
    const lengthTarget = e.target.value;

    if (lengthTarget >= 0 && lengthTarget.length <= 3) {
      const isSelected = selectedItems.some(item => item.cart_product_id === prevItem.cart_product_id);
      if(isSelected){
        setSelectedItems(selectedItems.filter(item => item.cart_product_id !== prevItem.cart_product_id));
        setCartCnt(prevItem, lengthTarget);
      } else {
        setCartCnt(prevItem, lengthTarget);
      }
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    if (prevItem.cnt > 1) {
      const isSelected = selectedItems.some(item => item.cart_product_id === prevItem.cart_product_id);
      if(isSelected){
        setSelectedItems(selectedItems.filter(item => item.cart_product_id !== prevItem.cart_product_id));
        setCartCntDown(prevItem);
      }
      else {
        setCartCntDown(prevItem);
      }
    } else {
      alert("수량은 1보다 커야합니다.");
      return prevItem; // 1이하로 내릴 수 없으면 기존 아이템 반환
    }
  }
    

  // 수량 UP
  function handleAddItem(prevItem) {
    if (prevItem.cnt < 999) {
      const isSelected = selectedItems.some(item => item.cart_product_id === prevItem.cart_product_id);
      if(isSelected){
        setSelectedItems(selectedItems.filter(item => item.cart_product_id !== prevItem.cart_product_id));
        setCartCntUp(prevItem);
      } else {
        setCartCntUp(prevItem);
      }
    } else {
      alert("수량은 999보다 작아야합니다.");
      return prevItem; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
    }
  }

  //--------------------------------------------------------------
  // 상품 주문서 작성을 처리하는 뮤테이션
  const {mutate:orderToMutation} = useMutation({mutationFn: orderToFetch})

  // 주문서 작성창 링크 함수(receipt에 넘어가면 해당 객체의 키와 값만 가지고 감(주의))
  function gotoLink(orderingData){
      orderToMutation(orderingData,{
          onSuccess: (data) => {
          alert(data.message);
          setOrderInformation("isCart", true);
          setOrderList(data.newProduct);
          setUserData(data.data);
          navigate("/orderStep/receipt");
          props.setActiveTab(2);
          },
          onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          console.error('상품을 삭제 처리하는 중 오류가 발생했습니다.', error);
          },
      });
  }

    if(isLoading){
      return <p>Loading..</p>;
    }
    if(isError){
      return <p>에러 : {error.message}</p>;
    }
  return(
    <div>
      <StepModule activeTab={props.activeTab}/>
        {/* 본문 시작 */}
        <div className={styles.body}>
          
          {/* 장바구니 정보 테이블 */}
          <table className={styles.table}>
            <thead>
              <tr>
                {/* 장바구니 목록에서만 체크 가능 */}
                {
                props.activeTab===1 &&
                <th>
                <input 
                type='checkbox'
                checked={selectAll}
                onChange={()=>handleSelectAllChange()}/>
                </th> 
                }
                <th>상품 이미지</th>
                <th className={styles.name}>상품 정보</th>
                <th>수량</th>
                <th>공급 가격</th>
              </tr>
            </thead>
            <tbody>
              {/* 장바구니 탭일 때는 장바구니 목록만 */}
              {props.activeTab===1 &&
              cartList.length > 0
              && cartList.map((item, index)=>(
              <tr key={index}>
                <td>
                  <input 
                  checked={selectedItems.some(select => select.cart_product_id === item.cart_product_id)}
                  onChange={() => checkedBox(item)}
                  type='checkbox'
                  /> 
                </td>
                <td><img className={styles.thumnail} src={item.product_image_original} alt='이미지'/></td>
                <td>
                  <h5 className={styles.link} onClick={()=>navigate(`/detail/${item.product_id}`)}>{item.product_title}</h5>
                  <div>
                  {item.cart_selectedOption && `옵션 : ${item.cart_selectedOption}`}
                  <p>상품 표준가 : <span className={styles.price}>{parseInt(item.cart_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</span></p>
                  </div>
                </td>
                {/* 수량 변경 */}
                <td>
                  <div className={styles.countTd}>
                  <button 
                  className={styles.editButton}
                  onClick={()=>handleDelItem(item)}
                  >
                    -
                  </button>                          
                  <input value={item.cnt} className={styles.input} onChange={(e)=>maxLengthCheck(e,item)} type='text' placeholder='숫자만 입력'/>
                  <button 
                  className={styles.editButton}
                  onClick={()=>handleAddItem(item)}
                  >
                    +
                  </button>
                  </div>
                </td>
                <td className={styles.price}>
                  {item.product_discount
                  ?
                  <>
                  <span style={{color: 'red', fontWeight: '750'}}>
                    ({item.product_discount}%)
                  </span>
                  &nbsp;<i className="fal fa-long-arrow-right"/>&nbsp;
                  {parseInt(item.cart_price * item.cnt - (((item.cart_price/100)*item.cart_discount)*item.cnt)).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </>
                  : `${(item.cart_price * item.cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                </td>
              </tr>
              ))}
            </tbody>
          </table>

          {/* 총 계산서 */}
          <div className={styles.finalCalculate}>
            <div className={styles.finalContainer}>
                <div className={styles.finalBox}>
                  <h2 style={{display:"flex", alignItems: 'center'}}>
                    총 상품 공급가
                  </h2>
                  <div className={styles.price}>
                    <h5>
                    \{
                      selectedItems.length > 0 ?
                        selectedItems.reduce((sum, item) =>
                          sum + ((item.cart_price * item.cnt) - ((item.cart_price / 100) * item.cart_discount) * item.cnt)
                        , 0).toLocaleString()
                        : 0
                      }
                    </h5>
                  </div>
                </div>
                <i className="fal fa-plus"></i>
                <div className={styles.finalBox}>
                  <h2>배송비</h2>
                  <div className={styles.price}>
                    <h5>\{delivery ? delivery.toLocaleString() : 0}</h5>
                  </div>
                </div>
                <i className="fal fa-equals"></i>
                <div className={styles.finalBox}>
                  <h2>최종 결제 금액</h2>
                  <div className={styles.price}>
                    <h5>\{
                      selectedItems.length > 0 ?
                        selectedItems.reduce((sum, item) =>
                        sum + ((item.cart_price * item.cnt) - ((item.cart_price / 100) * item.cart_discount) * item.cnt)
                        , delivery).toLocaleString()
                        : 0
                      }
                    </h5>
                  </div>
                </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            {/* 이전 페이지 */}
            <button
            className={styles.moveButton} 
            onClick={()=> {
              if(currentPage !== 1){
                setCurrentPage(currentPage - 1)
              } else {
                alert("해당 페이지가 가장 첫 페이지 입니다.")
              }}}>
                <i className="far fa-angle-left"/>
            </button>
            <div className={styles.moveButton}>
              {currentPage}
            </div>
            {/* 다음 페이지 */}
            <button
            className={styles.moveButton}
            onClick={()=> {
              if(basketList.length > 5){
                setCurrentPage(currentPage + 1)
              } else {
                alert("다음 페이지가 없습니다.")
              }}}>
                <i className="far fa-angle-right"/>
            </button>
          </div>


          {/* 다음 단계 버튼 */}
          <div>
            {/* 장바구니 (STEP 01) */}
            {props.activeTab===1 && 
            <>
            <button className={styles.deletebutton} onClick={()=>deletedList()}>삭제</button>
            <button onClick={selectedItems.length > 0 && props.activeTab === 1 ? ()=>gotoLink(selectedItems) : null} className={styles.button}>{selectedItems ? `${selectedItems.length}건` : `0건`} 주문하기</button>
            </>}
          </div>

        </div>
      </div>
  )
}