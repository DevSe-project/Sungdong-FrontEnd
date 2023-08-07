import { Tab } from './Tab'
import styles from './Detail.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { CategoryBar } from './CategoryBar'
import { TopBanner } from './TopBanner'
export function Detail(props) {
  //수량 개수 state
  const [count, setCount] = useState("1");

  const navigate = useNavigate();

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

function basketThis(product, count){
  if(count>0){
  //중복 확인 (.some 함수 : wishlist의 item.id 중 product.id와 같은 중복인 아이템이 있으면 true 반환 | !some이니 false면..== 중복이 아니면..)
    if (!props.orderList.some((item) => item.id === product.id)){
      const newBasketProduct = {
        ...product,
        cnt : count,
        finprice : (product.price * count),
      }
      const basketList = [...props.orderList, newBasketProduct];//props.wishlist 배열들과 배열 product를 합쳐서 새로운 배열 likelist를 생성
      props.setOrderList(basketList); //State에 새로운 배열 삽입
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
      const likelist = [...props.wishlist, product];//props.wishlist 배열들과 배열 product를 합쳐서 새로운 배열 likelist를 생성
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
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <main className={styles.main}>
        <section className={styles.head}>
          <div className={styles.headTop}>
            {/* 상품 이미지 부분 */}
            <div className={styles.headLeft}>
              <img src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="이미지" className={styles.thumnail} width="600px"/>
            </div>
            {/* 상품 정보 부분 */}
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
              <div className={styles.textButton}>
                <button className={styles.mainButton}>결제하기</button>
                <div className={styles.sideTextButton}>
                  <button onClick={()=>{basketThis(detailData, count)}} className={styles.sideButton}>장바구니</button>
                  <button onClick={()=>{likethis(detailData)}} className={styles.sideButton}>
                  {props.wishlist.some((item) => item.id === detailData.id) ? <i class="fa-solid fa-heart"/> 
                  : <i class="fa-regular fa-heart"/>}
                  &nbsp;찜하기
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 베스트 리뷰와 관련 상품 */}
          <div className={styles.headBottom}>
            <div className={styles.headBestReview}>
              <h2>베스트 리뷰</h2><br/>
              <div className={styles.rowBestReview}>
                <div className={styles.colBestReview}>
                  <h5>ID : 123</h5>
                  <p>
                    리뷰 : 너무 좋아요
                  </p>
                </div>
                <div className={styles.colBestReview}>
                  <h5>ID : 123</h5>
                  <p>
                    리뷰 : 너무 좋아요
                  </p>
                </div>
                <div className={styles.colBestReview}>
                  <h5>ID : 123</h5>
                  <p>
                    리뷰 : 너무 좋아요
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.headBestReview}>
              <h2>관련 상품</h2><br/>
              <div className={styles.rowBestReview}>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="관련 이미지" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="관련 이미지" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="관련 이미지" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" alt="관련 이미지" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
              </div>
            </div>  
          </div> 
        </section>
        {/* 탭 부분 */}
        <div className={styles.tab}>
          <Tab navigate={props.navigate}/>
        </div>
        <div id='1'>
          상세 정보임<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          asdasdasdasdasdasddasda<br></br><br></br><br></br><br></br><br></br><br></br></div>
        <div id='2'>
          리뷰임<br></br><br></br><br></br><br></br><br></br><br></br>
          asdasdasdasdasdasdasda<br></br><br></br><br></br><br></br><br></br>
        </div>
        <div id='3'>
        큐앤에이임<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        asdasdasdasdasdasd<br></br><br></br><br></br><br></br><br></br><br></br>
        asdasdsad
        </div>
      </main>
    </div>
  )
}