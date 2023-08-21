import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { useParams } from 'react-router-dom';
import styles from './ReviewPage.module.css';
export function ReviewPage(props){

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
  const reviewData = loadData();
  return(
    <div>
      <TopBanner/>  
      <CategoryBar/>
      <div className={styles.container}>
        <div className={styles.titleLocation}>
          <div className={styles.titleTag}>
            <h1><i className="fas fa-pen-square"/></h1>
            <h1>상품 리뷰</h1>
          </div>
          <div className={styles.titleTagContent}>
            <p>이 상품에 대한 리뷰를 남겨주세요!</p>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.productContainer}>
            <img src='../../image/logo.jpeg' alt="이미지"/>
            <div className={styles.productReview}>
              <h4>{props.data && reviewData.title}</h4>  
              <h1>
                <i style={{color: '#CC0000'}} className="fal fa-star" />
                <i style={{color: '#CC0000'}} className="fal fa-star" />
                <i style={{color: '#CC0000'}} className="fal fa-star" />
                <i style={{color: '#CC0000'}} className="fal fa-star" />
                <i style={{color: '#CC0000'}} className="fal fa-star" />
              </h1>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.reviewContainer}>
            <div className={styles.reviewInner}>
              <div className={styles.reviewInnerTitle}>
                상세리뷰
              </div>
              <div className={styles.reviewInnerInput}>
                <textarea className={styles.reviewDetail}/>
              </div>
            </div>
            <div className={styles.reviewInner}>
              <div className={styles.reviewInnerTitle}>
                사진첨부
              </div>
              <div className={styles.reviewInnerInput}>
                <input 
                className={styles.reviewPhoto} 
                type='file'
                />
              </div>
            </div>
            <div className={styles.reviewInner}>
              <div className={styles.reviewInnerTitle}>
                한줄요약
              </div>
              <div className={styles.reviewInnerInput}>
                <input className={styles.reviewTitle}/>
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
              <button className={styles.cancelButton}>취소</button>
              <button className={styles.addButton}>등록하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}