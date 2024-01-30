import { Tab } from './Tab'
import styles from './Detail.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TabInfo } from './TabInfo'
import { useBasketList, useDataActions, useDetailData, useListActions, useWishList } from '../../Store/DataStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '../../axios'
import { GetCookie } from '../../customFn/GetCookie'
import { handleForbiddenError, handleOtherErrors, handleUnauthorizedError } from '../../customFn/ErrorHandling'
import Cookies from 'js-cookie'
export function Detail(props) {

  const detailData = useDetailData();

  const {setDetailData, setUserData} = useDataActions();
  //데이터 불러오기
  const { isLoading, isError, error, data } = useQuery({queryKey:['data']});
  //Mutate를 위한 queryClient 사용
  const queryClient = useQueryClient();
  //데이터 불러오기 이전 loadData()함수 실행 금지
  useEffect(() => {
    const fetchData = async () => {
      if (data !== null) {
        await setDetailData(loadData());
      }
    };
  
    fetchData();
  }, [isLoading]);

    //주소창 입력된 id값 받아오기
    let {id} = useParams();

    const loadData = ()=> {
      if(data != null){
        //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
        const detaildata = data.find((item)=>item.product_id===id);
        return detaildata;
      } else {
        return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
      }
    }

    const navigate = useNavigate();
    //리스트 불러오기
    const wishList = useWishList();
    const { setWishList, setOrderList} = useListActions();
  
    //수량 개수 state
    const [count, setCount] = useState(1);
  
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(null);

    //장바구니 추가 함수
    const addToCart = async (product) => {
      if (isLoading) {
        // 데이터가 없으면 아무것도 하지 않고 종료
        return;
      }
      try {
        const token = GetCookie("jwt_token");
        const response = await axios.post("/cart/create", 
          JSON.stringify(product),
          {
            headers : {
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${token}`,
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
      } catch (error) {
        // 서버 응답이 실패인 경우
        if (error.response && error.response.status === 400) {
          // 서버가 400 Bad Request를 반환한 경우
          alert(error.response.data.message);          
          return console.error(error.response.data.message);
          // 서버 응답이 실패인 경우
        } else if (error.response && error.response.status === 401) {
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
  
  //결제하기 fetch
  const addToOrder = async(product) => {
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

    //견적함 추가 함수
    const addToEstimate = async (product) => {
      if (isLoading) {
        // 데이터가 없으면 아무것도 하지 않고 종료
        return;
      }
      try {
        const token = GetCookie('jwt_token');
        const response = await axios.post("/estimate/box", 
          JSON.stringify({
            ...product,
            optionSelect: optionSelected ? optionSelected : null,
            cnt: count,
          }),
          {
            headers : {
              "Content-Type" : "application/json",
              'Authorization': `Bearer ${token}`
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
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
  
    //장바구니 추가 함수
    const { mutate:cartMutate } = useMutation({mutationFn: addToCart})

  
    //즉시구매 함수
    const { mutate:orderMutate } = useMutation({mutationFn : addToOrder})


    //견적함 추가 함수
    const { mutate:addEstimateBox } = useMutation({mutationFn : addToEstimate});


  //수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e) => { 
    const lengthTarget = e.target.value; 
    //target.value.length = input에서 받은 value의 길이 
    //target.maxLength = 제한 길이

    if ( lengthTarget >= 0 && lengthTarget.length <= 3) { 
        setCount(lengthTarget); 
    } 
}

function setEstimateItem(product, count){

  addEstimateBox({product, count},
    {
      onSuccess: (ebData) => {
    // 메세지 표시
    console.log('상품을 견적함에 추가하였습니다.', ebData);
    // 추가 안내 메세지
    alert("견적함에 해당 상품을 추가하였습니다.");
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
    },
  });
}

// 즉시구매 함수
function buyThis(product, count){
  if(count <= 0){
    alert("수량은 0보다 커야합니다.")
    return;
  }

  if (product.option0 !== "" && !optionSelected) {
    alert("필수 옵션을 선택해주세요!");
    return;
  }

  if(product.supply <= 0){
    alert("해당상품의 재고가 없습니다.")
    return;
  } 
  const newProduct = {
    ...product,
    cnt: count,
    cart_selectedOption: optionSelected ? optionSelected : null
  }
    orderMutate(newProduct,{
      onSuccess: (data) => {
        // 메세지 표시
        console.log('상품을 전달하였습니다.', data);
        // 장바구니로 이동
        alert(data.message);
        Cookies.set('saveo_p', JSON.stringify(data.requestData));
        setUserData(data.data);
        navigate("/basket/receipt");
        props.setActiveTab(2);
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    }); // 상품을 장바구니에 추가하는 것을 호출
  }

// 장바구니 담기 함수
function basketThis(product, count){
  if(product.option0 !== null && (optionSelected === "" || optionSelected === null)){
    alert("옵션 선택 후 상품을 추가해주세요");
    return;
  }
  // login 캐쉬값이 저장되어 있는 것이 확인이 되면 허용
  const newProduct = {
    ...product,
    cnt: count,
    selectedOption: optionSelected ? optionSelected : null
  }
    cartMutate(newProduct,{
      onSuccess: (cartData) => {
        // 메세지 표시
        alert(cartData.message);
        console.log('상품이 장바구니에 추가되었습니다.', cartData);
        // 장바구니 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['cart']);
        // 장바구니로 이동
        navigate("/basket");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    })// 상품을 장바구니에 추가하는 것을 호출
  }
  // 찜하기
  function likethis(product){
    //중복 확인 (.some 함수 : wishList의 item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환 | !some이니 false면..== 중복이 아니면..)
    if (!wishList.some((item) => item.product_id === product.product_id)){
      const likelist = [...wishList, product]; //wishList 배열들과 배열 product를 합쳐서 새로운 배열 likelist를 생성
      setWishList(likelist); //State에 새로운 배열 삽입
      localStorage.setItem('likelist', JSON.stringify(likelist)); //새로고침해도 찜 목록 유지
      alert("해당 상품이 관심 상품 목록에 추가되었습니다.")
    } else {
      //wishList 아이템들 중에서 item.id와 product.id와 같지 않은 것들로 필터링하여 unlikelist에 저장
      const unlikelist = wishList.filter((item)=> item.product_id !== product.product_id);
      setWishList(unlikelist); // state에 새로운 list 삽입
      localStorage.setItem('likelist', JSON.stringify(unlikelist)); //새로고침하면 필터링 된 목록 표시
    }
  }

  const optionCreator = (item) => {
    let options = [];
    for(let i = 0; i<10; i++){
      options.push(item[`option${i}`])
    }
    return(
      <select value={optionSelected || ""}
      onChange={(e)=>{setOptionSelected(e.target.value)}}
      className={styles.selectSize}>
      <option value="">옵션 선택</option>
      {options.length > 0 && options.map((option, key) => {
      return (
        option !== "" &&
          <option key={key} value={option}>
            {(option !== null || option !== "" )&& option}
          </option>
        )
      })}
      </select>
    )
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
              <img src={detailData.product_image_original} alt="이미지" 
              className={styles.thumnail}/>
            </div>



            {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                {data !== null
                ? detailData.product_title
                : <div className={styles.skeleton}>&nbsp;</div>}
              </div>
              <h4 className={styles.h4}>
                {data !== null
                ? detailData.product_discount !== 0
                ? 
                <div className={styles.priceTag}>
                  <div>
                    <h3>{detailData.product_discount}%</h3>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <p style={{textDecoration: "line-through", color: "gray"}}>
                      {parseInt(detailData.product_price).toLocaleString('ko-KR',{ style: 'currency', currency: 'KRW' })}
                    </p>
                    {(detailData.product_price - (detailData.product_price / 100) * detailData.product_discount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}             
                  </div>
                </div>
                : `${parseInt(detailData.product_price).toLocaleString('ko-KR',{ style: 'currency', currency: 'KRW' })}`
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
                  {detailData.option0 !== "" &&
                  <div style={{display: 'flex', alignItems:'center', gap:'0.5em'}}>
                    {optionCreator(detailData)}
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
                {detailData.product_discount
                  ? `${parseInt((detailData.product_price - ((detailData.product_price / 100) * detailData.product_discount)) * count)
                    .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                  : `${(detailData.product_price * count).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                </h4>
                </>
                : <div className={styles.skeleton}>&nbsp;</div>
              }


              {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
              <div className={styles.textButton}>
                <button 
                className={styles.mainButton}
                onClick={()=> {detailData.product_supply <= 0 ? alert("해당 상품은 품절 상품입니다.") : buyThis(detailData, count)}}
                >{detailData.product_supply <= 0 ? '품절' : detailData.product_supply < 5 ? `결제하기 (재고 ${detailData.product_supply}개 남음)` : '결제하기'}</button>
                <div className={styles.sideTextButton}>
                  <button 
                  onClick={()=>{basketThis(detailData, count)}}
                  className={styles.sideButton}>장바구니</button>
                  <button 
                  onClick={()=>{likethis(detailData)}} 
                  className={styles.sideButton}>
                  {wishList.some((item) => item.product_id === detailData.product_id)
                  ? <i className="fa-solid fa-heart"/> //꽉 찬 하트와 빈 하트 아이콘
                  : <i className="fa-regular fa-heart"/>} 
                  &nbsp;찜하기
                  </button>
                  <button 
                  onClick={()=>{setEstimateItem(detailData, count)}}
                  className={styles.sideButton}>견적함</button>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* 탭 부분 */}
        <div className={styles.sticky} >
          <Tab navigate={props.navigate}/>
        </div>
        <TabInfo detailData={detailData}/>       
      </main>
    </div>
  )
}