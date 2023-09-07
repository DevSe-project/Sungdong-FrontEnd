import { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';

export function SearchBar(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정

  const inputRef = useRef(null); // input 엘리먼트에 대한 ref

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query !== '') {
      const filteredtitle = props.data.map((item) => item.title);
      const filteredResults = filteredtitle.filter((word) =>
        word.startsWith(query)
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
    setSelectedResultIndex(-1); // 검색어 변경 시 선택된 결과 초기화
  };

  const handleKeyDown = (event) => {
    // 방향키로 선택한 결과 항목 인덱스 업데이트
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedResultIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : -1
      );
    } else if (event.key === 'Enter' && selectedResultIndex !== -1) {
      // Enter 키를 누르면 선택한 결과 항목을 검색어로 설정
      setSearchTerm(results[selectedResultIndex]);
      sessionStorage.setItem('filterSearch', JSON.stringify(results[selectedResultIndex]))
      navigate("/category")
      setResults([]); // 결과 항목 숨기기
    }
  };

  // 선택된 결과 항목이 변경될 때 input 엘리먼트에 포커스 설정
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedResultIndex]);

  return (
    <div>
      <div className={styles.searchInputContainer}>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
        />
        <ul className={searchTerm !== "" && results.length > 0 && styles.result}>
          {results.map((result, index) => (
            <li
              key={index}
              className={index === selectedResultIndex ? styles.selected : styles.resultInner}
            >
              {result}
            </li>
          ))}
        </ul>
        {/* 돋보기 아이콘 */}
        <i className="fas fa-search" />
      </div>
    </div>
  );
}