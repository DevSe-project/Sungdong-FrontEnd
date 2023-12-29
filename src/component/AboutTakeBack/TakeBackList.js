import { useQuery } from '@tanstack/react-query';
import styles from './Table.module.css';
import { TakeBackListFilter } from './TakeBackListFilter';
import { useState } from 'react';
import axios from 'axios';
import { GetCookie } from '../../customFn/GetCookie';

export function TakeBackList(){
  //fetch
  const fetchData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/takeBack", 
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`,
          }
        }
      )
      return response.data;
    } catch(error) {
      throw new Error('원장 내역을 불러오던 중 오류가 발생했습니다.');
    }
  }
  //const { isLoading, isError, error, data:takeBackData } = useQuery({queryKey:['takeBack'], queryFn: ()=> fetchData();});
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
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 반품조회</h1>
      </div>
      {/* 필터 */}
      <TakeBackListFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>구분</th>
              <th>일자</th>
              <th>품명 및 규격</th>
              <th>사유</th>
              <th>수량</th>
              <th>금액</th>
              <th>처리일</th>
              <th>진행</th>
              <th>담당자</th>
              <th>입력자</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>구분</td>
              <td>일자</td>
              <td>품명 및 규격</td>
              <td>사유</td>
              <td>수량</td>
              <td>금액</td>
              <td>처리일</td>
              <td>진행</td>
              <td>담당자</td>
              <td>입력자</td>
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
  )
}