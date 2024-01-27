import { useEffect, useState } from 'react';
import styles from './Basket.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { useBasketList, useCartList, useListActions, useOrderList } from '../../Store/DataStore';
import axios from '../../axios';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export function Basket(props){

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
    } catch(error) {
      throw new Error('장바구니를 불러오던 중 오류가 발생했습니다.');
    }
  }
  // 장바구니 데이터 불러오기
  const { isLoading, isError, error, data:basketList } = useQuery({queryKey:['cart'], queryFn: ()=> fetchCartData()});

  const cartList = useCartList();
  const {setCartList, setCartCntUp, setCartCntDown, setCartCnt, resetCartList} = useListActions();


  const orderList = useOrderList();
  const { setOrderList } = useListActions();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // 배송가
  const delivery = 3000;

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  const location = useLocation();

  // 배송 주문 건 팝업띄우기
  const [openDeliveryModal, setOpenDeliveryModal] = useState(true);

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  // 일정 시간 후 팝업 닫음
  useEffect(()=> {
    const opentime = setInterval(() => {
      setOpenDeliveryModal((prev) => !prev)
    }, 1000)

    return () => clearInterval(opentime)
  }, [])

  // 장바구니 탭 - 결제 탭에서 뒤로가기 시 뒤로가기 방지 후 장바구니 탭으로 이동
  useEffect(() => {
    const handleBack = (e) => {
      e.preventDefault();
      alert("주문서 작성, 결제 중 뒤로가기 시 결제 정보가 초기화 됩니다.")
      props.setActiveTab(1);
      setSelectedItems([]);
      setSelectAll(false);
      navigate('/basket');
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
      sessionStorage.removeItem('orderData');
      sessionStorage.removeItem('newOrderData')
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

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.includes(product)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item !== product)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if(selectedItems.length + 1 === cartList.length){
        setSelectAll(true);
      }
    }
  };


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
      setCartCnt(prevItem, lengthTarget);
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    if (prevItem.cnt > 1) {
      setCartCntDown(prevItem);
    } else {
      alert("수량은 1보다 커야합니다.");
      return prevItem; // 1이하로 내릴 수 없으면 기존 아이템 반환
    }
  }
    

  // 수량 UP
  function handleAddItem(prevItem) {
    if (prevItem.cnt < 999) {
      setCartCntUp(prevItem);
    } else {
      alert("수량은 999보다 작아야합니다.");
      return prevItem; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
    }
  }

  // 주문서 작성창 링크 함수(receipt에 넘어가면 해당 객체의 키와 값만 가지고 감(주의))
  function gotoLink(){
    const isValidSupply = selectedItems.filter((item)=> item.supply <= 0)
    const duplicateTitles = isValidSupply.map((item) => item.title).join(", ")
    if(isValidSupply.length > 0){
      alert(`품절된 상품이 포함되어 있습니다.
            (품절된 상품 : ${duplicateTitles})`)
      return;
    }
    if(props.activeTab===1 
      && (selectedItems !== null || selectedItems.length > 0)) {
      const editedData = selectedItems.map((item) => ({
        productId : item.id,
        image : {
          mini : item.image.mini,
          original : item.image.original,
        },
        productName : item.title,
        supply: item.supply,
        cnt : Number(item.cnt), 
        price: item.price,
        // 이후 discount 값 수정 필요 (등급에 따라)
        discount : item.discount ? item.discount : 0, 
        optionSelected: item.optionSelected && item.optionSelected,
      }));
      // sessionStoragerage에 저장
      sessionStorage.setItem('orderData', JSON.stringify(editedData));
      setOrderList(editedData);
      navigate("/basket/receipt");
      props.setActiveTab(2);
    } else {
      alert("주문 요청한 상품 중에 재고가 없는 상품이 있습니다!");
    }
  }
  //스탭 메뉴
    const stepItems = [
      { id: 1, title: '장바구니' },
      { id: 2, title: '주문서 작성' },
      { id: 3, title: '결제하기' },
      { id: 4, title: '주문 완료' },
    ];


    if(isLoading){
      return <p>Loading..</p>;
    }
    if(isError){
      return <p>에러 : {error.message}</p>;
    }
  return(
    <div>
      {/* 스탭 모듈 */}
      <div className={styles.stepBlock}>
        <div className={styles.stepBar}>
        {stepItems.map((item, index)=> (
          <React.Fragment key={index}>
            {item.id === props.activeTab ?
            <div key={index} className={styles.stepOn}> 
              <p>Step 0{item.id}</p>
              <h5>{item.title}</h5>
            </div>
            : <div className={styles.step}>
              <p>Step 0{item.id}</p>
              <h5>{item.title}</h5>
            </div>
            }
            {item.id < 4 && 
            <div className={styles.iconlocation}>
              <i className="fal fa-chevron-right"></i>
            </div>
            }
          </React.Fragment>
          ))}
        </div>
      </div>

        {/* 본문 시작 */}
        <div className={styles.body}>
          {/* 팝업 띄우기 */}

            <div style={{display: 'block', height: '2em', width: '50%'}}>
              {openDeliveryModal &&
              <h5 style={{
                visibility: openDeliveryModal ? 'visible' : 'hidden', 
                color: '#CC0000',
                height: openDeliveryModal ? 'auto' : 0,
                overflow: 'hidden',
              }}>오후 12시 이전 주문 건 당일 배송, 오후 12시 이후 주문 건 익일 배송</h5>}
            </div>
          {props.activeTab===3 ? <h3>고객님께서 결제하실 상품정보입니다.</h3>
          : props.activeTab===4 && <h3>다음 상품을 준비하여 고객님께 보내드리겠습니다.</h3>}
          
          {/* 주문 정보 테이블 */}
          <table className={styles.table}>
            <thead>
              <tr>
                {/* 장바구니 목록에서만 체크 가능 */}
                {
                props.activeTab===1 
                ? 
                <th>
                <input 
                type='checkbox'
                checked={selectAll}
                onChange={()=>handleSelectAllChange()}/>
                </th> 
                : null
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
              basketList && cartList.map((item, index)=>(
              <tr key={index}>
                <td>
                  <input 
                  checked={selectedItems.includes(item)}
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
            {/* 주문서 작성 탭으로 넘어가면 체크된 목록들만 나열함(수정 불가) */}
            {props.activeTab > 1 && orderList &&
            orderList.map((item, key)=> (
              <tr key={key}>
                <td><img src={item.image.mini} alt='이미지'/></td>
                <td>
                  <h5 className={styles.link} 
                  onClick={()=>props.activeTab === 1
                  ? navigate(`/detail/${item.product_id 
                    ? item.product_id 
                    : item.product_id}`) 
                    : null}
                  >
                    {item.title 
                  ? item.title : item.productName
                  ? item.productName : null}</h5>
                  <div>
                  {item.optionSelected && `옵션 : ${item.optionSelected}`}
                  <p>상품 표준가 : <span className={styles.price}>\{item.cart_price.toLocaleString()}</span></p>
                  </div>
                </td>
                <td>{item.cnt}</td>
                <td className={styles.price}>
                {item.discount
                  ?
                  <>
                  <span style={{color: 'red', fontWeight: '750'}}>
                    ({item.discount}%)
                  </span>
                  &nbsp;<i className="fal fa-long-arrow-right"/>&nbsp;
                  \{((item.price * item.cnt) - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}
                  </>
                  : `\\${(item.price * item.cnt).toLocaleString()}`}
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
                    orderList.length !== 0 ?
                      orderList.reduce((sum, item) => //reduce 사용하여 배열 객체의 합계 계산, 0으로 초기화
                        sum + ((item.cart_price * item.cart_cnt) - (((item.cart_price / 100) * item.cart_discount) * item.cart_cnt))
                      , 0).toLocaleString()
                      :
                      selectedItems.length !== 0 ?
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
                    orderList.length !== 0 ?
                      orderList.reduce((sum, item) => //reduce 함수사용하여 배열 객체의 합계 계산, delivery값으로 sum을 초기화
                        sum + ((item.price * item.cnt) - (((item.price / 100) * item.discount) * item.cnt))
                      , delivery).toLocaleString()
                      :
                      selectedItems.length !== 0 ?
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
          {/* Outlet부분 (스탭 2,3,4) */}
          <Outlet></Outlet>

          {/* 다음 단계 버튼 */}
          <div>
            {/* 장바구니 (STEP 01) */}
            {props.activeTab===1 && 
            <>
            <button className={styles.deletebutton} onClick={()=>deletedList()}>삭제</button>
            <button onClick={selectedItems.length > 0 && props.activeTab === 1 ? ()=>{gotoLink();} : null} className={styles.button}>{selectedItems ? `${selectedItems.length}건` : `0건`} 주문하기</button>
            </>}
          </div>

        </div>
      </div>
  )
}