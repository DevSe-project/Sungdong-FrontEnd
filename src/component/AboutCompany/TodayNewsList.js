import { useState } from 'react';
import styles from './TodayNewsList.module.css'
import { useNavigate } from 'react-router-dom';
export function TodayNewsList(props){
    const navigate = useNavigate();
    // 게시물 데이터와 페이지 번호 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
  
    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
      const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return props.todayTopicData.slice(startIndex, startIndex + 5);
    };
  return(
    <main className={styles.body}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th className={styles.title}>글 제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {props.todayTopicData ? getCurrentPagePosts().map((item, index)=> (
          <tr key={index} className={styles.list}>
            <td>{item.id}</td>
            <td onClick={()=>navigate(`/todayTopicPost/${item.id}`)} className={styles.titleTd}>
              <h5>{item.title}</h5>
            </td>
            <td>관리자</td>
            <td>{item.date}</td>
          </tr>
          ))
        : '로딩중'}
        </tbody>
      </table>
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
          if(props.todayTopicData.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("존재하는 다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
    </main>
  )
}