import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ReviewPage.module.css';
import { useState } from 'react';
export function ReviewPage(props){
  const navigate = useNavigate();
  // 인풋 입력값 State
  const [reviewDetail, setReviewDetail] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");

  // 유효성검사 State
  const [isValid, setIsValid] = useState(false);

  //주소창 입력된 id값 받아오기
  let {id} = useParams();
  const loadData = ()=> {
    if(props.data){
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const data = props.data.find((item)=>item.id == id);
      return data;
    } else {
      return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
    }
  }
    //로딩된 데이터 불러오기
    const reviewData = loadData();
  
  // 리뷰 별 초기값
  const [star, setStar] = useState([
  <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />,
  <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />,
  <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />,
  <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />,
  <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />,
  ])

  // 리뷰 점수 함수
  function paintedStar(index){
    const editedStar = [...star];

    if(editedStar[index].props.className === "fal fa-star"){
      for(let i = 0; i<=index; i++){
        editedStar[i] = <i style={{color: '#CC0000', cursor: 'pointer'}} className="fas fa-star" />
      }
    } 
    if(editedStar[index].props.className === "fas fa-star"){
      for(let i = 4; i>index; i--){
        editedStar[i] = <i style={{color: '#CC0000', cursor: 'pointer'}} className="fal fa-star" />
      }
    }
    setStar(editedStar);
  }

  // 채워진 별점들만 필터링하여 변수에 저장
  const ratingStar = star.filter((item) => item.props.className === 'fas fa-star');

  // 별점마다의 부가 설명
  const isStar = () => {
    if(ratingStar.length === 1){
      return <>최악이네요</>
    }
    else if(ratingStar.length === 2){
      return <>조금 아쉽네요</>
    }
    else if(ratingStar.length === 3){
      return <>보통이네요</>
    }
    else if(ratingStar.length === 4){
      return <>좋아요</>
    }
    else if(ratingStar.length === 5){
      return <>최고예요</>
    }
  }

  // 리뷰 작성완료
  function addReview() {
    validateForm();
    if(isValid){
      const find = props.data.find((item) => item.id == id); // Use == for comparison
      const reviewLength = find.review ? find.review.length : 0;
      const currentDate =  new Date();
      const formattedDate = currentDate.toLocaleString();
      const editedData = {
        id: reviewLength ? reviewLength + 1 : 0,
        userId: 'asdasdx100',
        profileName: '주황색깔양말',
        rating: ratingStar.length,
        title: reviewTitle,              
        content: reviewDetail,
        image: '(사진)',
        date: formattedDate,
      };
      // 데이터 찾기
      const copyData = props.data.map((item) => {
        if (item.id === find.id) {
          return {
            ...item,
            review: item.review ? [...item.review, editedData] : [editedData], // data - review객체에 새로운 review 객체 추가
          };
        }
        return item;
      });
        props.setData(copyData);
        alert("성공적으로 리뷰가 작성되었습니다.")
        navigate(`/detail/${id}`)
    }
  }
  
  // 유효성 검사
  const validateForm = () => {
    const isStarValid =
    ratingStar.length !== 0 || null;
  
    const isInputValid =
      reviewTitle !== "" &&
      reviewDetail !== "";

    setIsValid(isStarValid && isInputValid);

    if (!isStarValid || !isInputValid){
      alert("작성이 되지 않은 란이 있습니다. 다시 확인해주세요!");
  }
  };
  return(
    <div>
      <TopBanner/>  
      <CategoryBar/>
      <div className={styles.container}>
        <div className={styles.titleLocation}>
          <div className={styles.titleTag}>
            <h1><i style={{color:"#CC0000"}} className="fas fa-pen-square"/></h1>
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
                {star.map((item, index) =>
                <span onClick={() => paintedStar(index)}>{item}</span>
                )}
              </h1>
              {/* 별점 별 부가 설명 */}
              <h4>{isStar()}</h4> 
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
                <textarea 
                value={reviewDetail} 
                onChange={(e)=>setReviewDetail(e.target.value)}
                className={styles.reviewDetail}
                />
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
                <input 
                value={reviewTitle}
                onChange={(e)=>setReviewTitle(e.target.value)}
                className={styles.reviewTitle}
                />
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
              <button onClick={()=>navigate("/delivery")} className={styles.cancelButton}>취소</button>
              <button onClick={()=>addReview()} className={styles.addButton}>등록하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}