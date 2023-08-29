import { Tab } from './Tab'
import styles from './Detail.module.css'
import { useHref, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { TabInfo } from './TabInfo'

export function Detail(props) {
  // Usenavigate
  const navigate = useNavigate();

 //수량 개수 state
  const [count, setCount] = useState("1");

  //추천 상품 STATE 변수
  const [recommendedItem, setRecommendedItem] = useState([]);

  //최근 리뷰 STATE 변수
  const [newReview, setNewReview] = useState([]); 


  useEffect(() => {

    // 추천 상품 렌더링시 띄우기
    const getRandomItem = () => {
      if(props.data){
      const shuffledArray = props.data.sort(() => 0.5 - Math.random());
      return shuffledArray.slice(0, 4);
      }
    };
    setRecommendedItem(getRandomItem);

    // 최근 리뷰 렌더링 시 띄우기
    if(detailData){
      const sliceReview = () => {
        if (detailData.review) { // detailData.review가 정의되었을 때만 처리
          const newData = [...detailData.review]; // 복사해서 정렬하도록 수정
          newData.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
          return newData.slice(0, 4);
        } return [];
      };
      const newReviewData = sliceReview();
      setNewReview(newReviewData);
    }
  }, [props.data])


  //주소창 입력된 id값 받아오기
  let {id} = useParams();
  const loadData = ()=> {
    if(props.data){
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const data = props.data.find((item)=>item.id==id);
      return data;
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
  // 수량 0을 장바구니에 저장하는 것 방지, ** 백엔드 : login 캐쉬값이 저장되어 있는 것이 확인이 되면 허용
  if(count > 0){
    const editedData = [{
      productId : product.id,
      userId: "asdfx100", 
      productName : product.title,
      cnt : Number(count), 
      price: product.price,
      finprice : (product.price * count), //총 계산액
      discount : product.discount ? product.discount : 0
    }]
      // editedData 객체를 JSON 형식의 문자열로 변환
      const buyData = JSON.stringify(editedData);
      // localStorage에 저장
      localStorage.setItem('orderData', buyData);
      props.setOrderList(editedData);
      navigate("/basket/receipt");
      props.setActiveTab(2);
  } else {
    alert("수량은 0보다 커야합니다.")
  }
}

// 장바구니 담기 함수
function basketThis(product, count){
  // 수량 0을 장바구니에 저장하는 것 방지, ** 백엔드 : login 캐쉬값이 저장되어 있는 것이 확인이 되면 허용
  if(count > 0){
    //중복 확인 (.some 함수 : basketList item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환 | !some이니 false면..== 중복이 아니면..)
    if (!props.basketList.some((item) => item.id === product.id)){
      const newBasketProduct = {
        ...product,
        cnt : count,
        finprice : (product.price * count), //총 계산액
      }
      //props.basketList의 원래 배열들과 배열 product를 합쳐서 새로운 배열을 생성하여 State에 삽입
      props.setBasketList([...props.basketList, newBasketProduct]); 
      // *중요 basketList의 배열들을 백엔드 서버로 전송하여 저장하기, Username의 db -> 장바구니 db에 아이템 저장해놓기 //
      alert("해당 상품이 장바구니에 추가되었습니다.")
    } else {
      alert("이미 장바구니에 추가된 상품입니다.")
    }
  } else {
    alert("수량은 0보다 커야합니다.")
  }
}


  // 찜하기
  function likethis(product){
    //중복 확인 (.some 함수 : wishlist의 item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환 | !some이니 false면..== 중복이 아니면..)
    if (!props.wishlist.some((item) => item.id === product.id)){
      const likelist = [...props.wishlist, product]; //props.wishlist 배열들과 배열 product를 합쳐서 새로운 배열 likelist를 생성
      props.setWishlist(likelist); //State에 새로운 배열 삽입
      localStorage.setItem('likelist', JSON.stringify(likelist)); //새로고침해도 찜 목록 유지
      alert("해당 상품이 관심 상품 목록에 추가되었습니다.")
    } else {
      //wishlist 아이템들 중에서 item.id와 product.id와 같지 않은 것들로 필터링하여 unlikelist에 저장
      const unlikelist = props.wishlist.filter((item)=> item.id !== product.id);
      props.setWishlist(unlikelist); // state에 새로운 list 삽입
      localStorage.setItem('likelist', JSON.stringify(unlikelist)); //새로고침하면 필터링 된 목록 표시
    }
  }

  //[최근 리뷰] 리뷰 평점에 따른 별 표시

  function ratingToStar(rating) {
    const totalStars = [];
  
    for (let i = 0; i < Number(rating); i++) {
      totalStars.push(<i style={{color: '#CC0000'}} className="fas fa-star" />);
    }
  
    for (let i = 0; i < 5 - Number(rating); i++) {
      totalStars.push(<i style={{color: '#CC0000'}} className="fal fa-star" />);
    }
  
    return <>{totalStars}</>;
  }

  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <main className={styles.main}>
        <section className={styles.head}>
          <div className={styles.headTop}>


            {/* 상품 이미지 부분 */}
            <div className={styles.headLeft}>
              <img src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="이미지" 
              className={styles.thumnail} width="600px"/>
            </div>



            {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                {props.data 
                ? detailData.title
                : <div className={styles.skeleton}>&nbsp;</div>}
              </div>
              <h4 className={styles.h4}>
                {props.data 
                ? detailData.discount !== 0
                ? 
                <div className={styles.priceTag}>
                  <div>
                    <h3>{detailData.discount}%</h3>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <p style={{textDecoration: "line-through", color: "lightgray"}}>
                      {detailData.price}원
                    </p>
                      {detailData.price-((detailData.price/100)*detailData.discount)}원
                  </div>
                </div>
                : `${detailData.price} 원`
                : <div className={styles.skeleton}>&nbsp;</div>}
              </h4>




              <div className={styles.textBox}>
                {/* 상품 수량 및 옵션, 최종 결제금액 */}
              {props.data ? 
              <>
                <label>
                수량 : <input value={count} className={styles.input} onChange={maxLengthCheck} type='number' placeholder='숫자만 입력'/> 개
                </label>
                <br/>
                  {detailData.option &&
                  <>
                  선택 옵션 :
                  <select>
                    {detailData.option.map((item) =>
                    <option>{item.value}</option>
                    )}
                  </select>
                  </>
                  }
                  </>
              : <div className={styles.skeleton}>&nbsp;</div>
              }
              </div>
              {props.data ?
                <>
                총 수량 {count ? count : 1}개 |
                <h4 className={styles.finalprice}>
                최종 결제 금액 : 
                {detailData.discount 
                ? `${(detailData.price-((detailData.price/100)*detailData.discount))*count}원` 
                : `${detailData.price * count}원`}
                </h4>
                </>
                : <div className={styles.skeleton}>&nbsp;</div>
              }


              {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
              <div className={styles.textButton}>
                <button 
                className={styles.mainButton}
                onClick={()=> buyThis(detailData, count)}
                >결제하기</button>
                <div className={styles.sideTextButton}>
                  <button 
                  onClick={()=>{basketThis(detailData, count)}}
                  className={styles.sideButton}>장바구니</button>
                  <button 
                  onClick={()=>{likethis(detailData)}} 
                  className={styles.sideButton}>
                  {props.wishlist.some((item) => item.id === detailData.id)
                  ? <i className="fa-solid fa-heart"/> //꽉 찬 하트와 빈 하트 아이콘
                  : <i className="fa-regular fa-heart"/>} 
                  &nbsp;찜하기
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* 최근 리뷰 */}
          <div className={styles.headBottom}>
            <div className={styles.headAtcTab}>
              <h2>최근 리뷰</h2><br/>
              <div className={styles.rowAtcTab}>
                {props.data && detailData && newReview 
                ? detailData.review == null 
                ? <p>리뷰가 없습니다!</p>
                :
                newReview.map((item, index) =>
                <div key={index} className={styles.colAtcTab}>
                  <span>{ratingToStar(item.rating)}</span>
                  <p className={styles.spanTag}>{item.profileName} 님</p>
                  <span className={styles.spanTag}>{item.date}</span>
                  <p className={styles.spanTag}>
                    {item.title}
                  </p>
                </div>
                )
                :
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
              </div>
            </div>


            {/* 추천 상품 */}
            <div className={styles.headAtcTab}>
              <h2>추천 상품</h2><br/>
              <div className={styles.rowAtcTab}>
                {recommendedItem ? recommendedItem.map((item, index) => 
                <div onClick={()=> navigate(`/detail/${item.id}`)} key={index} className={styles.colAtcTab}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="추천 이미지" width="100px"/>
                  </div>
                  <div className={styles.recommendTitle}>
                    <span className={styles.spanTag}>{item.title}</span>
                  </div>
                  <div className={styles.recommendPrice}>
                    <p>{`\\${item.price}`}</p>
                  </div>
                </div>
                ):
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
              </div>
            </div>  
          </div> 
        </section>



        {/* 탭 부분 */}
        <div className={styles.sticky} >
          <Tab navigate={props.navigate}/>
        </div>
        <TabInfo setData={props.setData} data={props.data} qnAData={props.qnAData} setQnAData={props.setQnAData} detailData={detailData}/>       
      </main>
    </div>
  )
}