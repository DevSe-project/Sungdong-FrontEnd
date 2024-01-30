import { useEffect, useRef, useState } from 'react'
import { Delivery } from './Delivery'
import styles from './DeliveryMain.module.css'
import { useOrderData } from '../../Store/DataStore'
export function DeliveryMain(props){

  // // 검색 로직
  // const handleSearch = (event) => {
  //   // 입력 값을 저장하는 로직
  //   const query = event.target.value;
  //   setSearchTerm(query);
  //   // 입력창이 공백이 아닐 때 (==검색 중이면?)
  //   if (query !== '') {
  //     // 데이터 중 타이틀로들만 구성된 변수 생성 후 
  //     // 그 변수들 중 첫 글자와 입력값이 일치하는 것을 연관 검색어 목록에 띄워줌
  //     const filteredtitle = filterOrderData.map((item) => item.productName);
  //     const filteredResults = filteredtitle.filter((word) =>
  //       word.includes(query)
  //     );
  //     setResults(filteredResults);
  //   // 입력창이 공백이면 연관 검색어를 띄우지 않는다.
  //   } else {
  //     setResults([]);
  //   }
  //   setSelectedResultIndex(-1); // 검색어 변경 시 선택된 결과 초기화
  // };

  return(
    <div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>주문/배송</h1>
        </div>
        {/* <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <input 
            className={styles.searchInput} 
            type='text' 
            placeholder='주문한 상품 검색하기'
            ref={inputRef}
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
            />
            <i 
            className="fas fa-search"
            onClick={()=> {
              setResultSearch(searchTerm);
              setResults([]); // 결과 항목 숨기기
            }}/>
          </div>
        </div> */}
      </div>
      <Delivery/>
    </div>
  )
}