import { useEffect, useState } from 'react';
import styles from './TodayNewsList.module.css'
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../Store/DataStore';
export function TodayNewsList(props){
    const {todayTopicData} = useDataStore();
    const navigate = useNavigate();
    // 게시물 데이터와 페이지 번호 상태 관리
    const [currentPage, setCurrentPage] = useState(1);
    const [filterSearch, setFilterSearch] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    // 검색 결과 텍스트 자르기
    const truncateText = (text, maxLength) => {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      } else {
        return text;
      }
    };

    useEffect(()=> {
      if(props.resultSearch){
        setFilterSearch(props.resultSearch);
      }
    }, [props.resultSearch])
  
    useEffect(() => {
      if (filterSearch !== "") {
        // 데이터에서 타이틀과 검색결과를 찾고
        const filtered = todayTopicData.filter((item) =>
          item.title.includes(props.resultSearch) || item.content.includes(props.resultSearch))
        // 목록 밑작업 해줌
        const addList = filtered.map((item, index) => ({
          ...item,
          listId: index,
        }));
        // 필터링 된 아이템 표시
        setFilteredItems(addList);
        setFilterSearch(truncateText(props.resultSearch, 10)); //검색 결과 표시 글자 자르기
      }
    }, [filterSearch])
  
    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
      const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return (
        filteredItems.length > 0 
      ? filteredItems.slice(startIndex, startIndex + 5)
      : todayTopicData.slice(startIndex, startIndex + 5)
      )
    };
  return(
    <main className={styles.body}>
      {props.resultSearch &&
      <h3 style={{margin: '1em'}}>
      "{filterSearch}" 에 대해
      <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
      이 검색 되었습니다.
      </h3>}
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
          {todayTopicData ? getCurrentPagePosts().map((item, index)=> (
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
          if(todayTopicData.length > 5){
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