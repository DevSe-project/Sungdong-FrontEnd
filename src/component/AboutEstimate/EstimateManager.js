import { useState } from 'react';
import { EstimateFilter } from './EstimateFilter';
import styles from './Table.module.css';
import { useQuery } from '@tanstack/react-query';

export function EstimateManager(){
  const { data, isLoading, isError, error } = useQuery({queryKey: ['data']});
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  //현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return data.length > 0 
    ? data.slice(startIndex, startIndex + 5)
    : data.slice(startIndex, startIndex + 5)
    
  };
  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return(
  <div>
    <div style={{width:'90%'}}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 견적함</h1>
      </div>
      {/* 필터 */}
      <EstimateFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순번</th>
              <th>견적번호</th>
              <th>견적일자</th>
              <th>품명 및 규격</th>
              <th>금액</th>
              <th>주문하기</th>
              <th>견적서 엑셀</th>
              <th>작성자</th>
              <th><input type='checkbox'></input></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>순번</td>
              <td>번호</td>
              <td>일자</td>
              <td>품명 및 규격</td>
              <td>금액</td>
              <td>주문하기</td>
              <td>견적서 엑셀</td>
              <td>작성자</td>
              <td><button className={styles.button}>삭제</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.buttonContainer}>
        {/* 이전 페이지 */}
        <button
          className={styles.pageButton} 
          onClick={()=> {
            if(currentPage !== 1){
              setCurrentPage(currentPage - 1)
            } else {
              alert("해당 페이지가 가장 첫 페이지 입니다.")
        }}}>
        <i className="far fa-angle-left"/>
        </button>
        <div className={styles.pageButton}>
          {currentPage}
        </div>
          {/* 다음 페이지 */}
        <button
        className={styles.pageButton}
        onClick={()=> {
          if(data.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
    </div>
  </div>
  )
}