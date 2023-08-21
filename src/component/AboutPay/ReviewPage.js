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
        <div>
          <i>아이콘</i>
          <h1>상품 리뷰</h1>
          <div>
            <p>이 상품에 대한 리뷰를 남겨주세요!</p>
          </div>
        </div>
        <div>
          <img src='../../image/logo.jpeg' alt="이미지"/>
          <div>
            <h4>{props.data && reviewData.title}</h4>  
            <h4>별점</h4>
          </div>
          <div>
            <h4>상세리뷰</h4>
            <textarea/>
          </div>
          <div>
            <h4>사진첨부</h4>
          </div>
          <div>
            <h4>한줄요약</h4>
            <input></input>
          </div>
        </div>
        <button>취소</button>
        <button>등록하기</button>
      </div>
    </div>
  )
}