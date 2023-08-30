import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TabInfo.module.css'
import { useState } from 'react';
import React from 'react';
import { QnAWrite } from './QnAWrite';
export function TabInfo(props){
    // 별점 필터 & 모달 창 state
    const [filterModal, setFilterModal] = useState(false);
    const [filterStar, setFilterStar] = useState(null);
      
    // QnA Modal State 변수
    const [selectedQnA, setSelectedQnA] = useState(null);

    // QnA 작성하기 Modal
    const [writeState, setWriteState] = useState(0);

  
    // 리뷰 포인트 & 스코어
    const textReviewPoint = 50;
    const photoReviewPoint = 150;
    const totalReviewScore = 5; 

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

  function funcFilterSter(id){
    if(filterModal){
      const startIndex = (reviewCurrentPage - 1) * 5; // 한 페이지에 5개씩 표시
      const filter = props.detailData.review.filter((item) => item.rating === id);
      const sliceData = filter.slice(startIndex, startIndex + 5);
      setFilterStar(sliceData);
    } 
  }

  function resetFuncFilterStar(){
    setFilterStar(null);
  }

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  
    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getReviewCurrentPagePosts = () => {
      const startIndex = (reviewCurrentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return props.detailData.review.slice(startIndex, startIndex + 5);
    };


  // 리뷰 그래프 데이터
  const reviewData = [
    { rating: 5, 리뷰: props.detailData.review ? props.detailData.review.filter((item) => item.rating === 5).length : 0 },
    { rating: 4, 리뷰: props.detailData.review ? props.detailData.review.filter((item) => item.rating === 4).length : 0 },
    { rating: 3, 리뷰: props.detailData.review ? props.detailData.review.filter((item) => item.rating === 3).length : 0 },
    { rating: 2, 리뷰: props.detailData.review ? props.detailData.review.filter((item) => item.rating === 2).length : 0 },
    { rating: 1, 리뷰: props.detailData.review ? props.detailData.review.filter((item) => item.rating === 1).length : 0 },
  ];

  // 상품정보 데이터
  const productInfo = [
    {label: '상품번호', value: props.detailData.id},
    {label: '브랜드', value: props.detailData.brand},
    {label: '원산지', value: props.detailData.madeIn},
    {label: '상품상태', value: props.detailData.new ? '새 상품' : '중고 상품'},
  ]

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return props.detailData.qna.slice(startIndex, startIndex + 5);
  };
  
  // 아이템 클릭 핸들러
  const handleQnAItemClick = (itemId) => {
    if (selectedQnA === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectedQnA(null);
    } else {
      setSelectedQnA(itemId);
    }
  };

  const returnInfo = [
    {label: '택배사', value: 'CJ대한통운'},
    {label: '반품 배송비', value: '편도 3,000원(최초 배송비 무료인 경우 6,000원 부과)'},
    {label: '보내실 곳', value: '울산광역시 남구 산업로440번길 8 (주)성동물산  (우 : 44781)'},
    {label: '반품/교환 요청 가능 기간', value: '구매자 단순 변심은 상품 구매 후 7일 이내(구매자 반품 배송비 부담)'},
    {label: '반품/교환 불가능 사유', value: '1. 반품요청기간이 지난 경우'},
  ]

  return(
    <div className={styles.tabInnerHeader}>

    {/* 탭 상품 정보 */}
    <h5 style={{fontWeight: '650'}}>상품 정보</h5>
    <div className={styles.productDetail}>
      {productInfo.map((item, index) =>
      <div key={index} className={styles.productDetailInner}>
        <div className={styles.productDetail_label}>
          <p>{item.label}</p>
        </div>
        <div className={styles.productDetail_content}>
          {item.value}
        </div>
      </div>
      )}
    </div>


    {/* 탭 상품 설명 */}
    <div id='1' className="tab-content">
      <div className={styles.reviewHeader}>
      <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>상품 설명</h3>
        <p>
        상품정보 내용임<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        </p>
      </div>
    </div>

    {/* 탭 리뷰 */}
    <div id='2' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>상품 리뷰</h3>
        <p>상품을 구매하신 분들이 작성하신 리뷰입니다. 리뷰 작성 시 아래 금액만큼 포인트가 적립 됩니다.</p>
        <p>텍스트 리뷰 : {textReviewPoint}원 | 포토, 동영상 리뷰 : {photoReviewPoint}원</p>
      </div>

      {/* 리뷰 정보 토글 */}
      <div className={styles.reviewViewToggle}>
        <div className={styles.reviewToggleInner}>
          <h5>사용자 총 평점</h5>
          <div>
          {props.data && props.detailData.review ?
            ratingToStar(Number(sumValues(props.detailData.review, 'rating')/props.detailData.review.length).toFixed(0))
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
            {props.data && props.detailData.review ?
              // 소수점 1자리까지 표현
              Number(sumValues(props.detailData.review, 'rating')/props.detailData.review.length).toFixed(1) 
              : 0} 
              &nbsp;/ {totalReviewScore}
          </h3>
        </div>
        <div className={styles.reviewToggleInner}>
          <h5>전체 리뷰 수</h5>
          <h3>{props.data && props.detailData.review ? props.detailData.review.length : 0}</h3>
        </div>
        <div className={styles.reviewToggleInner}>
          <h5>평점 비율</h5>
          <ResponsiveContainer 
            className={styles.graph} 
            width="100%" 
            height={100}
          >
            <BarChart
              data={reviewData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis 
                dataKey="rating" 
                label={{ value: '평점', position: 'insideBottom', offset: -10 }} 
              />
              <Tooltip />
              <Bar 
                dataKey="리뷰" 
                fill="#cc0000" 
              />
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
        <div 
          onClick={()=>setFilterModal(!filterModal)} 
          className={styles.reviewTabRatingView}
          > 별점 별 평가 필터
          <div>
            {props.data && props.detailData.review 
            ? props.detailData.review.length 
            : 0}
          </div>
          {props.detailData.review 
          && filterModal === true &&
            <div className={styles.filterUI}>
              <ul className={styles.filterStar}>
                <li 
                  className={styles.filterInner}
                  onClick={()=>resetFuncFilterStar()}
                > 전체 리뷰 보기 </li>

                { reviewData.map((item, key) => (
                <li 
                  key={key}
                  className={styles.filterInner} 
                  onClick={()=>funcFilterSter(item.rating)}
                >
                  {`${item.rating}점의 리뷰만 보기`}
                  <div>
                    {`${item.리뷰}`}
                  </div>
                </li>
                ))}
              </ul>
            </div>
          }
        </div>
      </div>

      {/* 리뷰 리스트 생성 */}
      {props.data && props.detailData.review 
      ? filterStar 
      ? filterStar.map((item,index) => 
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
          {props.detailData.title}
        </div>
        {item.image &&
        <div className={styles.reviewImg}>
          {item.image}
        </div>
        }
        <div className={styles.reviewListBody}>
          <h5>
            {item.title}
          </h5>
          <p>
            {item.content}
          </p>
        </div>
      </div>
      )
      : getReviewCurrentPagePosts().map((item,index) => 
      <div key={index} className={styles.review}>
        <div className={styles.reviewList}>
          <div className={styles.reviewListProfileImg}>
        <   img className={styles.thumnail} src='../../image/logo.jpeg' alt='프로필이미지' width={20}/>
          </div>
          <div className={styles.reviewListProfile}>
            <h4>{item.profileName}</h4>
            <span>{ratingToStar(item.rating)}</span>
            <p>{item.date}</p>
          </div>
        </div>
        <div className={styles.reviewListProduct}>
          {props.detailData.title}
        </div>
        {item.image &&
        <div className={styles.reviewImg}>
          {item.image}
        </div>
        }
        <div className={styles.reviewListBody}>
          <h5>
            {item.title}
          </h5>
          <p>
            {item.content}
          </p>
        </div>
      </div>
        )
      : 
      <div className={styles.review}>
            작성된 리뷰가 없습니다..
      </div>
      }
        <div className={styles.buttonContainer}>
          {/* 이전 페이지 */}
          <button
          className={styles.button} 
          onClick={()=> {
            if(reviewCurrentPage !== 1){
              setReviewCurrentPage(reviewCurrentPage - 1)
            } else {
              alert("해당 페이지가 가장 첫 페이지 입니다.")
            }}}>
              <i className="far fa-angle-left"/>
          </button>
          <div className={styles.button}>
            {reviewCurrentPage}
          </div>
          {/* 다음 페이지 */}
          <button
          className={styles.button}
          onClick={()=> {
            if(
              props.detailData.review 
              && props.detailData.review.length > 5
              )
            {
              setReviewCurrentPage(reviewCurrentPage + 1)
            } 
            else {
              alert("다음 페이지가 없습니다.")
            }}}>
              <i className="far fa-angle-right"/>
          </button>
        </div>
    </div>

    {/* 탭 Q & A */}
    <div id='3' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>Q & A</h3>
        <div className={styles.qnATop}>
          <p>구매하실 상품에 대해 궁금한 점이 있으면 질문해주세요.</p>
          <div className={styles.buttonBox}>
            <button className={styles.button}>
              내가 작성한 Q & A 보기
            </button>
            <button 
              className={styles.button} 
              onClick={()=>setWriteState(!writeState)}>
              Q & A 작성하기
            </button>
          </div>
        </div>
      </div>
      <table className={styles.table}>
        <thead 
        style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
        >
          <tr>
            <th>답변상태</th>
            <th className={styles.title}>글 제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {props.data 
          ? props.detailData.qna 
          ? getCurrentPagePosts().map((item, index)=> (
          <React.Fragment key={index}>
            <tr className={styles.list}>
              <td>{item.answer ? '답변완료' : '답변대기'}</td>
              <td className={styles.titleTd} onClick={()=>handleQnAItemClick(item.id)}>
                <h5>{item.title}</h5>
              </td>
              <td>{item.nickName}</td>
              <td>{item.date}</td>
            </tr>
            {/* 모달 */}
            {selectedQnA === item.id && (
              <tr>
                <td style={{padding: '1em'}} colSpan="4">
                  <div className={styles.question}>
                  <i className="far fa-comment-dots"/> {item.content}
                  </div>
                  <div className={styles.answer}>
                    {item.answer 
                    ? <><i class="far fa-comment-check"/> {item.answer}</>
                    : <p style={{color: 'lightgray'}}>아직 등록되지 않은 답변입니다.</p>}
                  </div>
                </td>
              </tr>
            )}
            </React.Fragment>
            ))
          : <tr><td>해당 상품에 Q & A가 없습니다.</td></tr>
          : <tr><td>로딩중</td></tr>
          }
        </tbody>
      </table>
      {/* write 모달창 */}
      {writeState
        ?
        <QnAWrite
          setData={props.setData}
          data={props.data}
          detailData={props.detailData}
          setWriteState={setWriteState}
          writeState={writeState}
        />
      :null}
      <div className={styles.buttonContainer}>
        {/* 이전 페이지 */}
        <button
        className={styles.button} 
        onClick={()=> {
          if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
          } else {
            alert("해당 페이지가 가장 첫 페이지 입니다.")
          }}}>
            <i className="far fa-angle-left"/>
        </button>
        <div className={styles.button}>
          {currentPage}
        </div>
        {/* 다음 페이지 */}
        <button
        className={styles.button}
        onClick={()=> {
          if(props.detailData.qna.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
    </div>

    {/* 반품 / 교환 정보 */}
    <div id='4' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>반품 / 교환정보</h3>
        <p>반품 시 반품사유, 택배사, 배송비, 반품지 주소를 협의 후 반품상품 발송 바랍니다.</p>
      </div>
      <div className={styles.form}>
        {returnInfo.map((item, key) => 
        <div key={key} className={styles.formInner}>
          <div className={styles.label}>
            <p>{item.label}</p>
          </div>
          <div className={styles.content}>
            <p>{item.value}</p>
          </div>
        </div>
        )}
      </div>
    </div>
  </div>
  )
}