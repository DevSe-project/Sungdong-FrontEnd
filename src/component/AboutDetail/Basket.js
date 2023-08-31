import { useEffect, useState } from 'react';
import styles from './Basket.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TopBanner } from '../AboutHeader/TopBanner';
import { CategoryBar } from '../AboutHeader/CategoryBar';
import React from 'react';
export function Basket(props){
  const navigate = useNavigate();
  //총 상품 금액
  const [sum, setSum] = useState(0);

  // 배송가, 할인가
  const delivery = 3000;
  const [discount, setDiscount] = useState(0);

  //최종 주문 금액
  const [resultOrderPrice, setOrderPrice] = useState(0);

  //수량
  const [count, setCount] = useState("");

  //수정하기 state
  const [editStatus, setEditStatus] = useState(props.basketList.map(()=>false));

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  const location = useLocation();

  // 장바구니 탭 - 결제 탭에서 뒤로가기 시 뒤로가기 방지 후 장바구니 탭으로 이동
  useEffect(() => {
    const handleBack = (e) => {
      e.preventDefault();
      alert("주문서 작성, 결제 중 뒤로가기 시 결제 정보가 초기화 됩니다.")
      props.setActiveTab(1);
      setSum(0);
      setDiscount(0);
      setOrderPrice(0);
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
      setSum(0);
      setDiscount(0);
      setOrderPrice(0);
      setSelectedItems([]);
      setSelectAll(false);
      props.setActiveTab(1);
      props.setOrderList([]);
      localStorage.removeItem('orderData');
      localStorage.removeItem('newOrderData')
    }
  }, [location]);

  //selectedItems의 변화가 일어날 때마다 totalPrice(selectedItems)를 작동함 (전체 합계 계산)
  useEffect(() => {
    totalPrice(selectedItems);
  }, [selectedItems]);

  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = props.basketList.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(productId) {
    if (selectedItems.includes(productId)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item !== productId)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, productId]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if(selectedItems.length + 1 === props.basketList.length){
        setSelectAll(true);
      }
    }
  };

  //상품 목록 삭제 함수
  const deletedList = () => {
  if(selectedItems !== null && selectedItems.length > 0){
    //props.wishlist 배열에서 selectedItems에 포함된(체크박스 선택된) 항목들이 아닌 것들로 새로운 배열을 생성
    const updatedWishlist = props.basketList.filter((item) => !selectedItems.includes(item)); 
    props.setBasketList(updatedWishlist);

    // 선택된 항목들 초기화
    setSelectedItems([]);
    
    //알림
    alert("장바구니에서 해당 품목이 성공적으로 삭제되었습니다.")
  } else {
    alert("선택된 항목이 없습니다.")
  }
};
  //수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e) => { 
    const lengthTarget = e.target.value; 
    //target.value.length = input에서 받은 value의 길이 
    //target.maxLength = 제한 길이

    if ( lengthTarget >= 0 && lengthTarget.length <= 3) { 
        setCount(lengthTarget); 
    } 
}
//수정하기 버튼을 눌렀을 때 함수 작동(개수 세는 함수)
  function editItem(index){
    const newEditStatus = [...editStatus]; 
    newEditStatus[index] = true;
    setEditStatus(newEditStatus);
    setCount(props.basketList[index].cnt); 
  }
  //수정완료 버튼 눌렀을 때 함수 작동(개수 저장 함수)
  function updatedItem(index){
    if(count > 0) {
      props.basketList[index].cnt = count;
      props.basketList[index].finprice = props.basketList[index].price * count;
      const newEditStatus = [...editStatus]; 
      newEditStatus[index] = false;
      setEditStatus(newEditStatus);
    } else {
      alert("수량은 0보다 커야합니다.")
    }
    totalPrice(selectedItems);
  }
  //때마다 selectedItems를 불러와서 총 계산을 계산하는 함수
  function totalPrice(item){
    let sum = 0;
    let totalDiscount = 0;
    item.forEach(itemId => {
      const calculate = props.basketList.find((item)=>item.id === itemId.id);
      if(calculate){
        sum += calculate.finprice;
        if (typeof calculate.discount === 'number') {
        totalDiscount += Number((calculate.finprice / 100) * calculate.discount);
        }
      }
    });
    //변수 저장식
    setSum(sum);
    setDiscount(totalDiscount);
    // 할인 금액이 총 가격을 넘지 않도록 보정
    totalDiscount = Math.min(totalDiscount, sum);
  
    const orderSum = sum + delivery - totalDiscount;
    setOrderPrice(orderSum);
  }

  // 링크 함수
  function gotoLink(){
    if(props.activeTab===1 && (selectedItems !== null || selectedItems.length > 0)) {
      const editedData = selectedItems.map((item) => ({
        productId : item.id,
        userId: "asdfx100", 
        productName : item.title,
        cnt : Number(item.cnt), 
        price: item.price,
        finprice: item.finprice,
        option: item.option && item.option,
      }));
      // editedData 객체를 JSON 형식의 문자열로 변환
      const editedDataString = JSON.stringify(editedData);
      // localStorage에 저장
      localStorage.setItem('orderData', editedDataString);
      props.setOrderList(selectedItems);
      navigate("/basket/receipt");
      props.setActiveTab(2);
    }
  }
  //스탭 메뉴
    const stepItems = [
      { id: 1, title: '장바구니' },
      { id: 2, title: '주문서 작성' },
      { id: 3, title: '결제하기' },
      { id: 4, title: '주문 완료' },
    ];
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
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
          {props.activeTab===3 ? <h3>고객님께서 결제하실 상품정보입니다.</h3>
          : props.activeTab===4 && <h3>다음 상품을 준비하여 고객님께 보내드리겠습니다.</h3>}
          {/* 주문 정보 테이블 */}
          <table className={styles.table}>
            <thead>
              <tr>
                {/* 장바구니 목록에서만 체크 가능 */}
                {props.activeTab===1 ? <th><input 
                type='checkbox'
                checked={selectAll}
                onChange={()=>handleSelectAllChange()}/></th> : null}
                <th>상품 이미지</th>
                <th className={styles.name}>상품 정보</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              {/* 장바구니 탭일 때는 장바구니 목록만 */}
              {props.activeTab===1 &&
              props.basketList ? props.basketList.map((item, index)=>(
              <tr key={index}>
                <td>
                  <input 
                  checked={selectedItems.includes(item)}
                  onChange={() => checkedBox(item)}
                  type='checkbox'
                  /> 
                </td>
                <td><img src='../image/logo.jpeg' alt='이미지'/></td>
                <td>
                  <h5 className={styles.link} onClick={()=>navigate(`/detail/${item.id}`)}>{item.title}</h5>
                  <div>
                  {item.option && `옵션 : ${item.option}`}
                  <p>상품 정가 : <span className={styles.price}>\{item.price}</span></p>
                  </div>
                </td>
                <td>{editStatus[index]===false 
                ? item.cnt 
                : <input value={count} className={styles.input} onChange={maxLengthCheck} minLength={1} maxLength={3} min={0} max={999} type='number' placeholder='숫자만 입력'/> }
                <br/>
                {editStatus[index]===false 
                ? <button
                onClick={()=>{editItem(index)}} 
                className={styles.editButton}
                >주문 수정</button> 
                : <button className={styles.editButton} onClick={()=>updatedItem(index)}>수정 완료</button>}
                </td>
                <td className={styles.price}>
                  {item.discount
                  ? 
                  <>
                    <p style={{textDecoration: "line-through", color: "lightgray"}}>\{item.finprice}</p> 
                    \{ item.finprice - (((item.price/100)*item.discount)*item.cnt)}
                  </>
                  : `\\${item.finprice}`}
                </td>
              </tr>
              ))
            : null}

            {/* 주문서 작성 탭으로 넘어가면 체크된 목록들만 나열함(수정 불가) */}
            {props.activeTab > 1 && props.orderList &&
            props.orderList.map((item, key)=> (
              <tr key={key}>
                <td><img src='../image/logo.jpeg' alt='이미지'/></td>
                <td>
                  <h5 className={styles.link} 
                  onClick={()=>props.activeTab <= 2 
                  ? navigate(`/detail/${item.id 
                    ? item.id 
                    : item.productId}`) 
                    : null}
                  >
                    {item.title 
                  ? item.title : item.productName
                  ? item.productName : null}</h5>
                  <div>
                  {item.option && `옵션 : ${item.option}`}
                  <p>상품 정가 : <span className={styles.price}>\{item.price}</span></p>
                  </div>
                </td>
                <td>{item.cnt}</td>
                <td className={styles.price}>
                  {item.discount
                  ? 
                  <>
                    <p style={{textDecoration: "line-through", color: "lightgray"}}>
                      \{item.finprice}
                    </p> 
                    \{ item.finprice - (((item.price/100)*item.discount)*item.cnt)}
                  </>
                  : `\\${item.finprice}`}
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
                    총 상품 금액
                    <p style={{margin: '0'}}>
                      (정가)
                    </p>
                  </h2>
                  <div className={styles.price}>
                    <h5>\{sum ? sum : props.orderList!== null || []
                    ? props.orderList.map((item)=> item.finprice) : 0} </h5>
                  </div>
                </div>
                <i className="fal fa-plus"></i>
                <div className={styles.finalBox}>
                  <h2>배송비</h2>
                  <div className={styles.price}>
                    <h5>\{delivery ? delivery : 0}</h5>
                  </div>
                </div>
                <i className="fal fa-minus"></i>
                <div className={styles.finalBox}>
                  <h2 style={{display:"flex", alignItems: 'center'}}>
                    할인 금액
                    <p style={{margin: '0'}}>
                      (상품 할인가격 포함)
                    </p>
                  </h2>
                  <div className={styles.price}>
                    <h5>\{sum ? discount : props.orderList !== null || [] ? props.orderList.map(item => 
                      ((item.price/100)*item.discount)*item.cnt) : 0}</h5>
                  </div>
                </div>
                <i className="fal fa-equals"></i>
                <div className={styles.finalBox}>
                  <h2>최종 결제 금액</h2>
                  <div className={styles.price}>
                    <h5>\{sum ? resultOrderPrice : props.orderList !== null || []
                    ? props.orderList.map((item) =>
                    item.finprice + delivery - ((item.price/100)*item.discount)*item.cnt) : 0}</h5>
                  </div>
                </div>
            </div>
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