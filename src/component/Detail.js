import { Tab } from './Tab'
import { ComponentHeader } from './ComponentHeader'
import styles from '../Detail.module.css'
export function Detail(props) {
  return(
    <div>
      <ComponentHeader/>
      <main className={styles.main}>
        <section className={styles.head}>
          <div className={styles.headTop}>
            <div className={styles.headLeft}>
              이미지
            </div>
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                <h2>상품명</h2>
              </div>
              <h2>가격</h2>
              <div className={styles.textBox}>
                <label>
                수량 : <input type='number' placeholder='숫자만 입력'/>
                </label>
                <br/>
                <label>
                  옵션 : 
                  <input type='checkbox'/>
                </label>
              </div>
              <h4>최종 결제 금액 : </h4>
              <div className={styles.textButton}>
                <button className={styles.mainButton}>결제하기</button>
                <div className={styles.sideTextButton}>
                  <button className={styles.sideButton}>장바구니</button>
                  <button className={styles.sideButton}>찜하기</button>
                </div>
              </div>
            </div>
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
              <div className={styles.rowBestReview}>
                <div className={styles.colBestReview}>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
                  <h5>상품 이름</h5>
                  <p>내용</p>
                </div>
                <div className={styles.colBestReview}>
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
      </main>
    </div>
  )
}