import { Tab } from './Tab'
import styles from './Detail.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TabInfo } from './TabInfo'
import { useBasketList, useListActions, useWishList } from '../../Store/DataStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
export function Detail(props) {

  const { isLoading, isError, error, data } = useQuery({queryKey:['data']});

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) {
        await loadData();
      }
    };
  
    fetchData();
  }, [isLoading]);

    const navigate = useNavigate();

    const wishList = useWishList();
  
    const basketList = useBasketList();
  
    const { setWishList, setOrderList, setBasketList} = useListActions();
  
   //수량 개수 state
    const [count, setCount] = useState("1");
  
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(null);
  
    //로그인 정보 불러오기
    const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));

    //장바구니 추가 함수
    const addToCart = async (product) => {
      try {
        if (isLoading) {
          // 데이터가 없으면 아무것도 하지 않고 종료
          return;
        }
        const response = await axios.post("/cart", 
          JSON.stringify({
            productId: product.id,  // 예시: product가 객체이고 id 속성이 있는 경우
            optionSelect: product.optionSelect,
            count: product.count,
          }),
          {
            headers : {
              "Content-Type" : "application/json"
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
      }
    };
  
      //장바구니 추가 함수
      const addToOrder = async (product) => {
        try {
          if (isLoading) {
            // 데이터가 없으면 아무것도 하지 않고 종료
            return;
          }
          const response = await axios.post("/order", 
            JSON.stringify({
              productId: product.id,  // 예시: product가 객체이고 id 속성이 있는 경우
              optionSelect: product.optionSelect,
              count: product.count,
            }),
            {
              headers : {
                "Content-Type" : "application/json"
              }
            }
          )
          // 성공 시 추가된 상품 정보를 반환합니다.
          return response.data;
        } catch (error) {
          // 실패 시 예외를 throw합니다.
          throw new Error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
        }
      };
  
    //장바구니 추가 함수
    const { cartMutate } = useMutation(addToCart, {
      onSuccess: (cartData) => {
        // 메세지 표시
        alert(cartData.message);
        console.log('상품이 장바구니에 추가되었습니다.', cartData);
        // 장바구니 상태를 다시 불러와 갱신합니다.
        // queryClient.invalidateQueries(['cart']);
        // 장바구니로 이동
        navigate("/basket");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    })
  
    //즉시구매 함수
    const { orderMutate } = useMutation(addToOrder, {
      onSuccess: (orderData) => {
        // 메세지 표시
        console.log('상품을 전달하였습니다.', orderData);
        // 장바구니로 이동
        setOrderList(orderData);
        navigate("/basket/receipt");
        props.setActiveTab(2);
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    });

  //서버 상태 체크하는 로직
  const checkServerStatus = async () => {
    try {
      const response = await axios.get('/status');
      return response.data.status === 'Server is running';
    } catch (error) {
      return false; // 서버에 연결할 수 없음
    }
  };

  // 서버 확인용
  const isServerRunning = checkServerStatus();

  //주소창 입력된 id값 받아오기
  let {id} = useParams();

  const loadData = async()=> {
    if(!isLoading){
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const detaildata = data.find((item)=>item.id==id);
      return detaildata;
    } else {
      return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
    }
  }

  //로딩된 데이터 불러오기
  const detailData = loadData();


  //수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e) => { 
    const lengthTarget = e.target.value; 
    //target.value.length = input에서 받은 value의 길이 
    //target.maxLength = 제한 길이

    if ( lengthTarget >= 0 && lengthTarget.length <= 3) { 
        setCount(lengthTarget); 
    } 
}


// 즉시구매 함수
function buyThis(product, count){
  if(isServerRunning)
    orderMutate(product); // 상품을 장바구니에 추가하는 것을 호출
  else {
    console.log(product)
    if(!props.login){
      alert("로그인 후 이용가능한 서비스입니다.")
      navigate("/login");
      return;
    }
    if(count <= 0){
      alert("수량은 0보다 커야합니다.")
      return;
    }
  
    if (product.option && !optionSelected) {
      alert("필수 옵션을 선택해주세요!");
      return;
    }

    if(product.supply <= 0){
      alert("해당상품의 재고가 없습니다.")
      return;
    } 
  
    const newBuyProduct = () => {
      if(product.option && optionSelected){
        return {
          productId : product.id,
          userId: inLogin.id, 
          image : {
            mini : product.image.mini,
            original : product.image.original,
          },
          productName : product.title,
          cnt : Number(count), 
          supply: product.supply,
          price: product.price,
          finprice : product.price * count, //총 계산액
          discount : product.discount ? product.discount : 0,
          optionSelected : optionSelected,
        }
      } return {
        productId : product.id,
        userId: inLogin.id,
        image : {
          mini : product.image.mini,
          original : product.image.original,
        },
        productName : product.title,
        cnt : Number(count), 
        supply: product.supply,
        price: product.price,
        finprice : product.price * count, //총 계산액
        // 이후 discount 값 수정 필요 (등급에 따라)
        discount : product.discount ? product.discount : 0,
      }
    }
      // // sessionStorage에 저장
      // sessionStorage.setItem('orderData', JSON.stringify([newBuyProduct]));
      setOrderList([newBuyProduct()]);
      navigate("/basket/receipt");
      props.setActiveTab(2);
    }
  }

// 장바구니 담기 함수
function basketThis(product, count){
  // login 캐쉬값이 저장되어 있는 것이 확인이 되면 허용
  if(isServerRunning)
    cartMutate(product); // 상품을 장바구니에 추가하는 것을 호출
  else {
    // 수량 0개 저장방지
    if(count <= 0){
      alert("수량은 0보다 커야합니다.")
      return;
    }
    if(!props.login){
      alert("로그인 후 이용가능한 서비스입니다.")
      navigate("/login");
      return;
    }

    // 필수옵션 선택 조건
    if (product.option && !optionSelected) {
      alert("필수 옵션을 선택해주세요!");
      return;
    }

    //중복 확인 (.some 함수 : basketList item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환)
    const isDuplicate = basketList !== null && basketList.some((basketItem) =>
    product.option 
    ?
    basketItem.id === product.id &&
    basketItem.userId === inLogin.id &&
    basketItem.optionSelected === optionSelected
    :
    basketItem.id === product.id &&
    basketItem.userId === inLogin.id
  );
  const newBasketProduct = () => { 
    if(product.option && optionSelected){
      return {
        ...product,
        userId: inLogin.id,
        cnt : count,
        finprice : product.price * count, //총 계산액
        optionSelected : optionSelected,
      }
    } return {
      ...product,
      userId: inLogin.id,
      cnt : count,
      finprice : product.price * count
    }
  }

  if (isDuplicate) {
    alert("이미 장바구니에 추가된 상품입니다.");
  } else {
    // 중복 상품이 아닌 경우에만 추가
    setBasketList([newBasketProduct()]);
    alert("해당 상품이 장바구니에 추가되었습니다.");
  }
}
}
  // 찜하기
  function likethis(product){
    //중복 확인 (.some 함수 : wishList의 item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환 | !some이니 false면..== 중복이 아니면..)
    if (!wishList.some((item) => item.id === product.id)){
      const likelist = [...wishList, product]; //wishList 배열들과 배열 product를 합쳐서 새로운 배열 likelist를 생성
      setWishList(likelist); //State에 새로운 배열 삽입
      localStorage.setItem('likelist', JSON.stringify(likelist)); //새로고침해도 찜 목록 유지
      alert("해당 상품이 관심 상품 목록에 추가되었습니다.")
    } else {
      //wishList 아이템들 중에서 item.id와 product.id와 같지 않은 것들로 필터링하여 unlikelist에 저장
      const unlikelist = wishList.filter((item)=> item.id !== product.id);
      setWishList(unlikelist); // state에 새로운 list 삽입
      localStorage.setItem('likelist', JSON.stringify(unlikelist)); //새로고침하면 필터링 된 목록 표시
    }
  }
  if(isLoading){
    return <p>Loading..</p>;
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }

  return(
    <div>
      <main className={styles.main}>
        <section className={styles.head}>
          <div className={styles.headTop}>


            {/* 상품 이미지 부분 */}
            <div className={styles.headLeft}>
              <img src={data != null && detailData.image.original} alt="이미지" 
              className={styles.thumnail}/>
            </div>



            {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                {data != null
                ? detailData.title
                : <div className={styles.skeleton}>&nbsp;</div>}
              </div>
              <h4 className={styles.h4}>
                {data != null
                ? detailData.discount !== 0
                ? 
                <div className={styles.priceTag}>
                  <div>
                    <h3>{detailData.discount}%</h3>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <p style={{textDecoration: "line-through", color: "gray"}}>
                      {detailData.price.toLocaleString()}원
                    </p>
                      {(detailData.price-((detailData.price/100)*detailData.discount)).toLocaleString()}원
                  </div>
                </div>
                : `${detailData.price.toLocaleString()} 원`
                : <div className={styles.skeleton}>&nbsp;</div>}
              </h4>




              <div className={styles.textBox}>
                {/* 상품 수량 및 옵션, 최종 결제금액 */}
              {data != null ? 
              <>
                <label>
                수량 : <input value={count} className={styles.input} onChange={maxLengthCheck} type='number' placeholder='숫자만 입력'/> 개
                </label>
                <br/>
                  {detailData.option &&
                  <div style={{display: 'flex', alignItems:'center', gap:'0.5em'}}>
                    옵션 :
                    <select 
                    value={optionSelected || ""}
                    onChange={(e)=>{setOptionSelected(e.target.value)}}
                    className={styles.selectSize}
                    >
                      <option value="" disabled>옵션 선택</option>
                      {detailData.option.map((item, index) =>
                      <option key={index} value={item.value}>{item.value}</option>
                      )}
                    </select>
                  </div>
                  }
                  </>
              : <div className={styles.skeleton}>&nbsp;</div>
              }
              </div>
              {data != null ?
                <>
                총 수량 {count ? count : 1}개 |
                <h4 className={styles.finalprice}>
                최종 결제 금액 : 
                {detailData.discount 
                ? `${((detailData.price-((detailData.price/100)*detailData.discount))*count).toLocaleString()}원` 
                : `${(detailData.price * count).toLocaleString()}원`}
                </h4>
                </>
                : <div className={styles.skeleton}>&nbsp;</div>
              }


              {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
              <div className={styles.textButton}>
                <button 
                className={styles.mainButton}
                onClick={()=> {detailData.supply <= 0 ? alert("해당 상품은 품절 상품입니다.") : buyThis(detailData, count)}}
                >{detailData.supply <= 0 ? '품절' : detailData.supply < 5 ? `결제하기 (재고 ${detailData.supply}개 남음)` : '결제하기'}</button>
                <div className={styles.sideTextButton}>
                  <button 
                  onClick={()=>{basketThis(detailData, count)}}
                  className={styles.sideButton}>장바구니</button>
                  <button 
                  onClick={()=>{likethis(detailData)}} 
                  className={styles.sideButton}>
                  {wishList.some((item) => item.id === detailData.id)
                  ? <i className="fa-solid fa-heart"/> //꽉 찬 하트와 빈 하트 아이콘
                  : <i className="fa-regular fa-heart"/>} 
                  &nbsp;찜하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* 탭 부분 */}
        <div className={styles.sticky} >
          <Tab navigate={props.navigate}/>
        </div>
        <TabInfo decryptData={props.decryptData} login={props.login} setLogin={props.setLogin} detailData={detailData}/>       
      </main>
    </div>
  )
}