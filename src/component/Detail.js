import { Tab } from './Tab'
import { ComponentHeader } from './ComponentHeader'
import styles from '../Detail.module.css'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
export function Detail(props) {
  const [count, setCount] = useState("");
  let {id} = useParams();
  const detaildata = props.data.find((item)=>item.id==id);
  if (!detaildata) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }
  function maxLengthCheck(e) { 
    const target = e.target; 
    //target.value.length = input에서 받은 value의 길이 
    //target.maxLength = 제한 길이 
    setCount(target.value);
    if (target.value.length > target.maxLength) { 
        target.value = target.value.slice(0, target.maxLength); 
    } 
} 
  return(
    <div>
      <ComponentHeader/>
      <main className={styles.main}>
        <section className={styles.head}>
          <div className={styles.headTop}>
            <div className={styles.headLeft}>
              <img src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" className={styles.thumnail} width="600px"/>
            </div>
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                <h2>{detaildata.title}</h2>
              </div>
              <h2>가격 : {detaildata.price}원</h2>
              <div className={styles.textBox}>
                <label>
                수량 : <input onChange={(e)=>maxLengthCheck(e)} minLength={1} maxLength={3} min={0} max={999} type='number' placeholder='숫자만 입력'/>
                </label>
                <br/>
                <label>
                  옵션 : 
                  <input type='checkbox'/>
                </label>
              </div>
              <h4>최종 결제 금액 : {detaildata.price * count} 원</h4>
              <div className={styles.textButton}>
                <button className={styles.mainButton}>결제하기</button>
                <div className={styles.sideTextButton}>
                  <button className={styles.sideButton}>장바구니</button>
                  <button className={styles.sideButton}>찜하기</button>
                </div>
              </div>
            </div>
          </div>
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
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <div className={styles.frame}>
                    <img className={styles.thumnail} src="http://pop7.co.kr/web/product/big/201806/344_shop1_15289487355825.jpg" width="100px"/>
                  </div>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
              </div>
            </div>  
          </div> 
        </section>
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