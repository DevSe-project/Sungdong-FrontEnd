import styles from './TodayNews.module.css'
import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner'
import { useEffect, useRef, useState } from 'react'
import { TodayNewsCard } from './TodayNewsCard'
import { TodayNewsList } from './TodayNewsList'
export function TodayNews(props){
  const [filterList, setFilterList] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [filterSearch, setFilterSearch] = useState('제목');


  const [searchTerm, setSearchTerm] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  const [results, setResults] = useState([]);
  const [indexedResults, setIndexedResults] = useState([]);
  // 연관 검색어 방향키 이동, 설정을 위한 State
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정

  // input 엘리먼트에 대한 ref
  const inputRef = useRef(null);



  // 검색 로직
  const handleSearch = (event) => {
    // 입력 값을 저장하는 로직
    const query = event.target.value;
    setSearchTerm(query);
    // 입력창이 공백이 아닐 때 (==검색 중이면?)
    if (query !== '' && filterSearch === '제목') {
      // 데이터 중 타이틀로들만 구성된 변수 생성 후 
      // 그 변수들 중 첫 글자와 입력값이 일치하는 것을 연관 검색어 목록에 띄워줌
      const filteredTitle = props.todayTopicData
        .map((item) => item.title)
        .filter((word) => word.includes(searchTerm));

          // 원본 검색 결과에서 제한 길이로 표시하기 위한 함수
      const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
          return text.slice(0, maxLength) + '...';
        } else {
          return text;
        }
      };

      // 검색 결과를 제한 길이로 표시하고, 색인 결과를 저장
      setResults(filteredTitle);
      setIndexedResults(
        filteredTitle.map((result) => truncateText(result, 10))
      );
    // 입력창이 공백이면 연관 검색어를 띄우지 않는다.
    } else if(query !== '' && filterSearch === '내용') {
      const filteredTitle = props.todayTopicData
        .map((item) => item.content)
        .filter((word) => word.includes(searchTerm));

        const truncateText = (text, maxLength) => {
          if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
          } else {
            return text;
          }
        };

      // 검색 결과를 제한 길이로 표시하고, 색인 결과를 저장
      setResults(filteredTitle);
      setIndexedResults(
        filteredTitle.map((result) => truncateText(result, 10))
      );
    } else {
      setResults([]);
    }
    setSelectedResultIndex(-1); // 검색어 변경 시 선택된 결과 초기화
  };

  const handleKeyDown = (event) => {
    // 방향키로 선택한 결과 항목 인덱스 업데이트
    if (event.key === 'ArrowDown') { // 아래 방향키
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === 'ArrowUp') { // 위 방향키
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : -1
      );
    } else if (event.key === 'Enter') {
      // Enter 키를 누르면 선택한 결과 항목을 검색어로 설정
      if(selectedResultIndex !== -1) {
        setSearchTerm(indexedResults[selectedResultIndex]);
        setResults([]); // 결과 항목 숨기기
        setIndexedResults([]);
        setResultSearch(results[selectedResultIndex]);
        setSearchTerm("");
      } else {
        setResultSearch(searchTerm);
        setIndexedResults([]);
        setResults([]); // 결과 항목 숨기기
      }
    } else if (event.key === 'Tab' && selectedResultIndex !== -1) {
      // 탭 키 누르면 자동완성
      event.preventDefault();
      setSearchTerm(results[selectedResultIndex]);
    }
  };

  // 선택된 결과 항목이 변경될 때 input 엘리먼트에 포커스 설정
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedResultIndex]);


  return( 
    <div>
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>오늘의 뉴스</h1>
          <div className={styles.contentsFilter}>
            <p 
            style={{cursor: 'pointer'}} 
            onClick={()=>setFilterList(false)}>
              <i className="fas fa-object-ungroup"/> 
              카드 별 보기
            </p>
            <p 
            style={{cursor: 'pointer'}} 
            onClick={()=>setFilterList(true)}>
              <i className="fas fa-bars"/> 
              목록 별 보기
            </p>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <div onClick={()=>setFilterModal(!filterModal)} className={styles.searchFilter}>
            <div>
              <span>
                {filterSearch}
              </span>
            </div>
            <div>
              <i 
              style={{color:'gray'}} 
              className={filterModal 
              ? 'fas fa-angle-up' 
              : 'fas fa-angle-down'}
              />
            </div>
            {props.todayTopicData && filterModal &&
            <div className={styles.filterUI}>
              <ul className={styles.filter}>
                <li 
                style={filterSearch === '제목' ? {fontWeight: '650'} : null}
                onClick={()=>setFilterSearch('제목')}
                className={styles.filterInner}
                > 제목 </li>
                <li 
                style={filterSearch === '내용' ? {fontWeight: '650'} : null} 
                onClick={()=>setFilterSearch('내용')}
                className={styles.filterInner}
                > 내용 </li>
              </ul>
            </div>
            }
          </div>
          <div className={styles.searchInputBox}>
            <input 
            className={styles.searchInput} 
            type='text' 
            placeholder='게시물 검색'
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
            />
            <ul 
            className={searchTerm !== "" 
            && indexedResults.length > 0 
            ? styles.result
            : null}>
            {indexedResults && indexedResults.map((result, index) => (
              <li
                key={index}
                className={index === selectedResultIndex 
                  ? styles.selected 
                  : styles.resultInner}
              >
                {result}
              </li>
            ))}
            </ul>
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
        {/* 필터에 따라 표시되는 형태가 다름 */}
        {!filterList 
        ? <TodayNewsCard resultSearch={resultSearch} todayTopicData={props.todayTopicData} setTodayTopicData={props.setTodayTopicData} />
        : <TodayNewsList resultSearch={resultSearch} todayTopicData={props.todayTopicData} setTodayTopicData={props.setTodayTopicData} />
        }
      </main>
    </div>
  )
}