import { Tab } from './Tab'
import styles from './Detail.module.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Detail(props) {
  //수량 개수 state
  const [count, setCount] = useState("1");


  // 리뷰 포인트 & 스코어
  const textReviewPoint = 50;
  const photoReviewPoint = 150;
  const totalReviewScore = 5; 

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
    const sliceReview = () => {
      if (detailData.review) { // detailData.review가 정의되었을 때만 처리
        const newData = [...detailData.review]; // 복사해서 정렬하도록 수정
        newData.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        return newData.slice(0, 4);
      } return []
    };
    setNewReview(sliceReview);
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

  //리뷰 평점 합계 계산
  function sumValues(obj, key) {
    let total = 0;
  
    for (const item of Object.values(obj)) {
      if (item[key] !== undefined) {
        total += item[key];
      }
    }
  
    return total;
  }

  //리뷰 평점에 따른 별 표시

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

  // 리뷰 그래프 데이터
  const reviewData = [
    { rating: 5, 리뷰: detailData.review ? detailData.review.filter((item) => item.rating === 5).length : 0 },
    { rating: 4, 리뷰: detailData.review ? detailData.review.filter((item) => item.rating === 4).length : 0 },
    { rating: 3, 리뷰: detailData.review ? detailData.review.filter((item) => item.rating === 3).length : 0 },
    { rating: 2, 리뷰: detailData.review ? detailData.review.filter((item) => item.rating === 2).length : 0 },
    { rating: 1, 리뷰: detailData.review ? detailData.review.filter((item) => item.rating === 1).length : 0 },
  ];


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
                ? `${detailData.price} 원`
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
                <label>
                  선택 옵션 : 
                  <input type='checkbox'/>
                </label>
                </>
              : <div className={styles.skeleton}>&nbsp;</div>}
              </div>
              {props.data ?
                <>
                총 수량 {count ? count : 1}개 |
                <h4 className={styles.finalprice}>
                최종 결제 금액 : {detailData.price * count}원 </h4></>
                : <div className={styles.skeleton}>&nbsp;</div>
              }


              {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
              <div className={styles.textButton}>
                <button className={styles.mainButton}>결제하기</button>
                <div className={styles.sideTextButton}>
                  <button onClick={()=>{basketThis(detailData, count)}}
                  className={styles.sideButton}>장바구니</button>
                  <button onClick={()=>{likethis(detailData)}} 
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
                    {item.content}
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
                <div key={index} className={styles.colAtcTab}>
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
        <div className={styles.tab}>
          <Tab navigate={props.navigate}/>
        </div>
        <div className={styles.tabInnerHeader}>


          {/* 탭 상품 정보 */}
          <div id='1'>
            <div className={styles.reviewHeader}>
              <h3>상품 정보</h3>
              <p>
                대충 제품 정보 내용
              </p>
            </div>
          </div>


          {/* 탭 리뷰 */}
          <div id='2'>
            <div className={styles.reviewHeader}>
              <h3>상품 리뷰</h3>
              <p>상품을 구매하신 분들이 작성하신 리뷰입니다. 리뷰 작성 시 아래 금액만큼 포인트가 적립 됩니다.</p>
              <p>텍스트 리뷰 : {textReviewPoint}원 | 포토, 동영상 리뷰 : {photoReviewPoint}원</p>
            </div>

            {/* 리뷰 정보 토글 */}
            <div className={styles.reviewViewToggle}>
              <div className={styles.reviewToggleInner}>
                <h5>사용자 총 평점</h5>
                <div>
                {props.data && detailData.review ?
                  ratingToStar(sumValues(detailData.review, 'rating')/detailData.review.length)
                : <>
                  <i style={{color: '#CC0000'}} className="fal fa-star" />
                  <i style={{color: '#CC0000'}} className="fal fa-star" />
                  <i style={{color: '#CC0000'}} className="fal fa-star" />
                  <i style={{color: '#CC0000'}} className="fal fa-star" />
                  <i style={{color: '#CC0000'}} className="fal fa-star" />
                  </>
                }
                </div>
                <h3>
                  {props.data && detailData.review ?
                    sumValues(detailData.review, 'rating')/detailData.review.length 
                    : 0} 
                    / {totalReviewScore}
                </h3>
              </div>
              <div className={styles.reviewToggleInner}>
                <h5>전체 리뷰 수</h5>
                <h3>{props.data && detailData.review ? detailData.review.length : 0}</h3>
              </div>
              <div className={styles.reviewToggleInner}>
                <h5>평점 비율</h5>
                <ResponsiveContainer className={styles.graph} width="100%" height={100}>
                  <BarChart
                    data={reviewData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <XAxis dataKey="rating" label={{ value: '평점', position: 'insideBottom', offset: -10 }} />
                    <Tooltip />
                    <Bar dataKey="리뷰" fill="#cc0000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 리뷰 정렬 탭 */}
            <div className={styles.reviewTab}>
              <div className={styles.reviewTabFilter}>
                <div>
                  베스트 순
                </div>
                <div className={styles.reviewTabFront}>
                  최신 순
                </div>
              </div>
              <div className={styles.reviewTabRatingView}>
                별점 별 평가 보기 
                <div>
                  {props.data && detailData.review ? detailData.review.length : 0}
                </div>
              </div>
            </div>

            {/* 리뷰 리스트 생성 */}
            {props.data && detailData.review ?
            detailData.review.map((item, index) => 
            <div key={index} className={styles.review}>
              <div className={styles.reviewList}>
                <div className={styles.reviewListProfileImg}>
                  <img className={styles.thumnail} src='../../image/logo.jpeg' alt='프로필이미지' width={20}/>
                </div>
                <div className={styles.reviewListProfile}>
                  <h4>{item.profileName}</h4>
                  <span>{ratingToStar(item.rating)}</span>
                  <p>{item.date}</p>
                </div>
              </div>
              <div className={styles.reviewListProduct}>
                {detailData.title}
              </div>
              {item.image &&
              <div className={styles.reviewImg}>
                {item.image}
              </div>
              }
              <div className={styles.reviewListBody}>
                <p>
                  {item.content}
                </p>
              </div>
            </div>
          )
          : <div className={styles.review}>
              작성된 리뷰가 없습니다..
            </div>
          }
          </div>


          {/* 탭 Q & A */}
          <div id='3'>
            큐앤에이임<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            asdasdasdasdasdasd<br></br><br></br><br></br><br></br><br></br><br></br>
            asdasdsad
          </div>


          {/* 반품 / 교환 정보 */}
          <div id='4'>
          </div>
        </div>
      </main>
    </div>
  )
}