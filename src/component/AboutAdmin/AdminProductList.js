import { useEffect, useState } from 'react';
import { AdminHeader } from './AdminHeader'
import { AdminMenuData } from './AdminMenuData'
import React from 'react';
import styles from './AdminProductList.css'
import { useNavigate } from 'react-router-dom';
export function AdminProductList(props){
  // 카테고리
  const [selectedCategory, setSelectedCategory] = useState('전체'); //메인 카테고리
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); //서브 카테고리
  const [filterSearch, setFilterSearch] = useState("");
  
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  //Td 선택시 Modal State 변수
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();

  //옵션 선택 state
  const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));

  const mainCategory = JSON.parse(sessionStorage.getItem('category'));
  const subCategory = JSON.parse(sessionStorage.getItem('subCategory'));
  const resultSearch = JSON.parse(sessionStorage.getItem('filterSearch'));
  const resultSearchBrand = JSON.parse(sessionStorage.getItem('filterSearchBrand'));
  const resultSearchCode = JSON.parse(sessionStorage.getItem('filterSearchCode'));
  const resultSearchOption = JSON.parse(sessionStorage.getItem('filterSearchOption'));

      // 카테고리 찾기 - mainCategory와 subCategory가 바뀔 때 마다 실행
      useEffect(() => {
        //props.categoryData가 있을 때만 진행
        if (props.categoryData) {
          if (mainCategory) {
            setSelectedCategory(mainCategory);
          }
          // 메인 카테고리와 함께 출력하기 위해 로직 구성
          if (subCategory) {
            const findCategory = props.categoryData.find((item) =>
              item.subMenuItems.some((item) => item.item === subCategory)
            );
            // 상위 카테고리를 찾으면 표시
            if(findCategory) {
            setSelectedSubCategory(subCategory);
            setSelectedCategory(findCategory.title);
            }
          // 서브 카테고리가 없을때 초기값으로 변경
          } else {
            setSelectedSubCategory(null);
          }
          // 검색 카테고리
        if (resultSearch) { 
            setFilterSearch(resultSearch);
          if (props.data) { // 데이터가 로드되었는지 확인
            // 필터링 로직
              const findCategory = props.data.find((item) => item.title.includes(resultSearch));
              if(findCategory) {
                setSelectedCategory(findCategory.category.main);
              } else {
                setSelectedCategory('전체');
              }
            }
          } else if (resultSearchBrand) {
            setFilterSearch(resultSearchBrand);
            if (props.data) { // 데이터가 로드되었는지 확인
              // 필터링 로직
                const findCategory = props.data.find((item) => item.brand.includes(resultSearchBrand));
                if(findCategory) {
                  setSelectedCategory(findCategory.category.main);
                } else {
                  setSelectedCategory('전체');
                }
              }
          } else if (resultSearchCode) {
            setFilterSearch(resultSearchCode);
            if (props.data) { // 데이터가 로드되었는지 확인
              // 필터링 로직
                const findCategory = props.data.find((item) => item.id.toString().includes(resultSearchCode.toString()));
                if(findCategory) {
                  setSelectedCategory(findCategory.category.main);
                } else {
                  setSelectedCategory('전체');
                }
              }
            } else if (resultSearchOption) {
              setFilterSearch(resultSearchOption);
              if (props.data) { // 데이터가 로드되었는지 확인
                // 필터링 로직
                  const findCategory = props.data.find((item) => item.option&& item.option.some((item) => item.value.includes(resultSearchOption)));
                  if(findCategory) {
                    setSelectedCategory(findCategory.category.main);
                  } else {
                    setSelectedCategory('전체');
                  }
                }
                // 일치하는 카테고리를 반환하거나 null을 반환합니다.
            } else {
            setFilterSearch("");
          }
        }
      }, [mainCategory, subCategory, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption, props.categoryData, props.data]);
      // 찾은 카테고리에 따라 아이템 필터링
      useEffect(() => {
        // 상품이 렌더링 되었을 때만 진행
    // 상품이 렌더링 되었을 때만 진행
    if (props.data) {
      // 조건 - 상위 카테고리가 '전체' (기본 값) 일 때
      if (selectedCategory === '전체') {
        const addCntList = props.data.map((item, index) => ({
          ...item,
          cnt: item.cnt ? item.cnt : 1,
          finprice: item.finprice ? item.finprice : item.price,
          listId: index,
        }));
        setFilteredItems(addCntList);
        return;
      }
      
      // 조건 - 검색 필터가 공백이 아닐때 (검색 했을 때)
      if (filterSearch !== "") {
        // 데이터에서 검색결과를 포함하는 대상 찾기
        if (resultSearch) {
          const findCategory = props.data.filter((item) => item.title.includes(resultSearch));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            cnt: item.cnt ? item.cnt : 1,
            finprice: item.finprice ? item.finprice : item.price,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
          } else if (resultSearchBrand) {
            const findCategory = props.data.filter((item) => item.brand.includes(resultSearchBrand));
            const addCntList = findCategory.map((item, index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice: item.finprice ? item.finprice : item.price,
              listId: index,
            }));
            // 필터링 된 아이템 표시
            setFilteredItems(addCntList);
            return;
          } else if (resultSearchCode) {
            const findCategory = props.data.filter((item) => item.id.toString().includes(resultSearchCode));
            const addCntList = findCategory.map((item, index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice: item.finprice ? item.finprice : item.price,
              listId: index,
            }));
            // 필터링 된 아이템 표시
            setFilteredItems(addCntList);
            return;
          } else if (resultSearchOption) {
            const findCategory = props.data.filter((item) => item.option&& item.option.some((item)=>item.value.includes(resultSearchOption)));
            const addCntList = findCategory.map((item, index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice: item.finprice ? item.finprice : item.price,
              listId: index,
            }));
            // 필터링 된 아이템 표시
            setFilteredItems(addCntList);
            return;
          }
        } else {
          // 조건(2) - 서브 카테고리를 null이 아닐때, 즉 서브 카테고리가 있을 때
          if(selectedSubCategory !== null){
            const filtered = props.data.filter((item) => item.category.sub === selectedSubCategory);
            const addCntList = filtered.map((item,index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice : item.finprice ? item.finprice : item.price,
              listId : index,
            }));
            setFilteredItems(addCntList);
          // 상위 카테고리만 선택했을 때
          } else if(selectedSubCategory === null){
            const filtered = props.data.filter((item) => item.category.main === selectedCategory);
            const addCntList = filtered.map((item,index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice : item.finprice ? item.finprice : item.price,
              listId : index,
            }));
            setFilteredItems(addCntList);
          } 
        }
      }
    }, [props.data, selectedCategory, selectedSubCategory, filterSearch, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption]);

  // 아이템 클릭 핸들러
  const handleItemClick = (itemId) => {
    if (selectedData === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectedData(null);
    } else {
      setSelectedData(itemId);
    }
  };
    
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return filteredItems.slice(startIndex, startIndex + 5);
  };
  return(
    <div>
      <AdminHeader/>
      <div className={styles.body}>
        <AdminMenuData/>
        <div className={styles.tableLocation}>
          <table className={styles.table}>
            <thead 
            style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
            >
              <tr>
                <th>이미지</th>
                <th>상품코드</th>
                <th>상세보기</th>
                <th>상품명</th>
                <th>단위</th>
                <th>표준가</th>
                <th style={{fontWeight: '650'}}>공급가</th>
                <th>더보기</th>
              </tr>
            </thead>
            <tbody>
              {props.data 
              ? filteredItems.length > 0
              ? getCurrentPagePosts().map((item, index)=> (
              <React.Fragment key={index}>
                <tr className={styles.list}>
                  <td><img src={item.image.mini} alt='이미지'></img></td>
                  <td>{item.id}</td>
                  <td 
                    className={styles.detailView}
                    onClick={()=>navigate(`/detail/${item.id}`)}>
                    상세보기
                  </td>
                  <td className={styles.detailView} onClick={()=>handleItemClick(item.id)}>
                    <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.title}</h5>
                  </td>
                  <td>EA</td>
                  <td>\{item.price.toLocaleString()}</td>
                  <td style={{fontWeight: '750'}}>
                    {item.finprice
                    ? item.discount
                    ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                    : `\\${item.finprice.toLocaleString()}`
                    : item.price.toLocaleString()}
                  </td>
                  <td 
                    className={styles.detailView}
                    onClick={()=>handleItemClick(item.id)}>
                    더보기&nbsp;{selectedData === item.id  
                    ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                    : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;
                  </td>
                </tr>
                {/* 모달 */}
                {selectedData === item.id && (
                <tr>
                  <td colSpan="8">
                    <table className={styles.colTable}>
                      <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                        <tr>
                          <th style={{width: '25%'}}>
                            브랜드
                          </th>
                          <th style={{width: '10%'}}>
                            옵션
                          </th>
                          <th style={{width: '20%'}}>
                            재고
                          </th>
                          <th style={{width: '10%'}}>
                            적용률
                          </th>
                          <th style={{width: '10%'}}>
                            할인금액
                          </th>
                          <th style={{width: '10%', fontWeight: '650'}}>
                            공급가
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {item.brand}
                          </td>
                          <td>
                            {item.option 
                            &&            
                            <span>옵션있음</span>
                            }
                          </td>
                          <td>
                            설정된 재고수량
                          </td>
                          <td>
                            {item.discount}%
                          </td>
                          <td style={{fontWeight: '750'}}>
                            {item.discount
                            ? `\\${(((item.price/100)*item.discount)*item.cnt).toLocaleString()}`
                            : 0}
                          </td>
                          <td style={{fontWeight: '750'}}>
                          {item.finprice
                          ? item.discount
                          ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                          : `\\${item.finprice.toLocaleString()}`
                          : item.price.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
    
                )}
                </React.Fragment>
                ))
              : <tr><td>해당하는 상품과 관련된 상품이 존재하지 않습니다.</td></tr>
              : <tr><td>로딩중</td></tr>
              }
            </tbody>
          </table>
        </div>
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
            if(filteredItems.length > 5){
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