import { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';

export function SearchBar(props) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  // 연관 검색어 방향키 이동, 설정을 위한 State
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정
  const [searchFilter, setSearchFilter] = useState("상품명");

  // input 엘리먼트에 대한 ref
  const inputRef = useRef(null);


  // 검색 로직
  const handleSearch = (event) => {
    // 입력 값을 저장하는 로직
    const query = event.target.value;
    setSearchTerm(query);
    // 입력창이 공백이 아닐 때 (==검색 중이면?)
    if (query !== '') {
      if(searchFilter === '상품명'){
        // 데이터 중 타이틀로들만 구성된 변수 생성 후 
        // 그 변수들 중 첫 글자와 입력값이 일치하는 것을 연관 검색어 목록에 띄워줌
          const filteredtitle = props.data && props.data.map((item) => item.title);
          const filteredResults = filteredtitle.filter((word) =>
            word.includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '코드'){
          const filteredtitle = props.data && props.data.map((item) => item.id);
          const filteredResults = filteredtitle.filter((word) =>
            word.toString().includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '브랜드'){
          const filteredtitle = props.data && props.data.map((item) => item.brand);
          const filteredResults = filteredtitle.filter((word) =>
            word.includes(query)
          );
          setResults(filteredResults);
        } else if (searchFilter === '옵션'){
          const filteredResults = props.data && props.data.flatMap((item) =>
          item.option && item.option.map((option) => option.value).filter((word) =>
            word.includes(query)
          )
        ).filter(Boolean);
          setResults(filteredResults);
        } 
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
        setSearchTerm(results[selectedResultIndex]);
        switch (searchFilter) {
          case '상품명':
            sessionStorage.setItem('filterSearch', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '브랜드':
            sessionStorage.setItem('filterSearchBrand', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearch');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '코드':
            sessionStorage.setItem('filterSearchCode', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearch');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '옵션':
            sessionStorage.setItem('filterSearchOption', JSON.stringify(results[selectedResultIndex]));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearch');
            break;
          default:
            sessionStorage.setItem('filterSearch', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
        }
        navigate("/category")
        setResults([]); // 결과 항목 숨기기
        setSearchTerm("");
      } else {
        switch (searchFilter) {
          case '상품명':
            sessionStorage.setItem('filterSearch', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '브랜드':
            sessionStorage.setItem('filterSearchBrand', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearch');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '코드':
            sessionStorage.setItem('filterSearchCode', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearch');
            sessionStorage.removeItem('filterSearchOption');
            break;
          case '옵션':
            sessionStorage.setItem('filterSearchOption', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearch');
            break;
          default:
            sessionStorage.setItem('filterSearch', JSON.stringify(searchTerm));
            sessionStorage.removeItem('filterSearchBrand');
            sessionStorage.removeItem('filterSearchCode');
            sessionStorage.removeItem('filterSearchOption');
            break;
        }
        navigate("/category")
        setResults([]); // 결과 항목 숨기기
        setSearchTerm("");
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

  return (
    <div>
      <div className={styles.searchInputContainer}>
        <select 
        className={styles.select}
        name="searchFilter"
        value={searchFilter}              
        onChange={(e)=>setSearchFilter(e.target.value)}
        >
          <option value='상품명'>
            상품명
          </option>
          <option value='코드'>
            코드
          </option>
          <option value='브랜드'>
            브랜드
          </option>
          <option value='옵션'>
            옵션
          </option>
        </select>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
        />
        <ul 
        className={searchTerm !== "" 
        && results.length > 0 
        ? styles.result
        : null}>
          {results && results.map((result, index) => (
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
        {/* 돋보기 아이콘 */}
        <i 
        onClick={() => {
          sessionStorage.setItem('filterSearch', JSON.stringify(searchTerm))
          navigate("/category")
          setResults([]); // 결과 항목 숨기기
          setSearchTerm("");
        }}
        className="fas fa-search" />
      </div>
    </div>
  );
}