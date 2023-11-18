import { useEffect, useRef, useState } from 'react';
import styles from './SeperateSearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export function SeperateSearchBar() {
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useQuery({queryKey:['data']});

  const [selectedResult, setSelectedResult] = useState(null);

  const initialSearchTerms = {
    productName: "",
    productCode: "",
    productBrand: "",
    productOption: ""
  };

  const [searchTerm, setSearchTerm] = useState(initialSearchTerms);

  const [results, setResults] = useState([]);
  // 연관 검색어 방향키 이동, 설정을 위한 State
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1); // 초기 선택 인덱스는 -1로 설정

  // input 엘리먼트에 대한 ref
  const inputRef = {
    productName: useRef(null),
    productCode: useRef(null),
    productBrand: useRef(null),
    productOption: useRef(null)
  };


  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedResultIndex]);

  // 검색 엔진 구현
  const handleSearch = () => {
    if(data){
    const filteredResults = data.filter(item => {
      const productName = searchTerm.productName;
      const productCode = searchTerm.productCode;
      const productBrand = searchTerm.productBrand;
      const productOption = searchTerm.productOption;

      return (
        (searchTerm.productName && item.title.includes(productName)) ||
        (searchTerm.productCode && item.id.toString().includes(productCode)) ||
        (searchTerm.productBrand && item.brand.includes(productBrand)) ||
        (searchTerm.productOption && (Array.isArray(item.option) && item.option.some(option => option.value.includes(productOption))))
          // item.option이 배열이고 적어도 하나의 item.value가 존재하는 경우에만 처리
      )})
      setResults(filteredResults);
    };
  }

  
  // 입력창의 변화에 따른 SearchTerm 업데이트
  const handleInputChange = (inputName, value) => {
    setSearchTerm(prevSearchTerm => ({
      ...prevSearchTerm,
      [inputName]: value
    }));
  };


  const handleKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedResultIndex(prevIndex =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedResultIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : -1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedResultIndex !== -1) {
        const selectedResult = results[selectedResultIndex];
        setSearchTerm(selectedResult);
        // Update sessionStorage based on the selected result
        if (searchTerm.productName !== '') {
          sessionStorage.setItem('filterSearch', JSON.stringify(selectedResult));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (searchTerm.productBrand !== '') {
          sessionStorage.setItem('filterSearchBrand', JSON.stringify(selectedResult));
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (searchTerm.productCode) {
          sessionStorage.setItem('filterSearchCode', JSON.stringify(selectedResult));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchOption');
        } else {
          sessionStorage.setItem('filterSearchOption', JSON.stringify(selectedResult));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearch');
        }
  
        navigate("/category");
        setResults([]);
        setSearchTerm(initialSearchTerms);
      } else {
        if (searchTerm.productName !== '') {
          sessionStorage.setItem('filterSearch', JSON.stringify(searchTerm.productName));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (searchTerm.productBrand !== '') {
          sessionStorage.setItem('filterSearchBrand', JSON.stringify(searchTerm.productBrand));
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (searchTerm.productCode !== '') {
          sessionStorage.setItem('filterSearchCode', JSON.stringify(searchTerm.productCode));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchOption');
        } else {
          sessionStorage.setItem('filterSearchOption', JSON.stringify(searchTerm.productOption));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearch');
        }
        navigate("/category");
        setResults([]);
        setSearchTerm(initialSearchTerms);
      }
    } else if (event.key === 'Tab' && selectedResultIndex !== -1) {
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

  if(isLoading){
    return <p>Loading..</p>;
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div>
      <div className={styles.searchInputContainer}>
      {Object.keys(searchTerm).map(inputName => (
        <input
        key={inputName}
        ref={inputRef[inputName]}
        className={styles.searchInput}
        type="text"
        placeholder={
          inputName == 'productName' 
          ? '상품명' 
          : inputName == 'productBrand'
          ? '브랜드'
          : inputName == 'productCode'
          ? '코드'
          : inputName == 'productOption'
          && '옵션'
        }
        value={searchTerm[inputName]}
        onChange={e => handleInputChange(inputName, e.target.value)}
        onKeyDown={handleKeyDown}
        />
        ))}
        <ul className={results.length > 0 ? styles.result : null}>
          {results && results.map((result, index) => (
            <li
              key={index}
              className={index === selectedResultIndex
                ? styles.selected
                : styles.resultInner}
              onClick={() => setSelectedResult(result)}
            >
              <span>{result.title}</span>
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