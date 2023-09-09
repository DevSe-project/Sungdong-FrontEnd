import { useEffect, useState } from "react";
import { TopBanner } from "./TopBanner";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
export function Category(props){
    // 카테고리
    const [selectedCategory, setSelectedCategory] = useState('전체'); //메인 카테고리
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); //서브 카테고리
    const [filterSearch, setFilterSearch] = useState("");
    
    // 필터된 항목을 저장할 상태 변수
    const [filteredItems, setFilteredItems] = useState([]);

    const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'))
    const mainCategory = JSON.parse(sessionStorage.getItem('category'));
    const subCategory = JSON.parse(sessionStorage.getItem('subCategory'));
    const resultSearch = JSON.parse(sessionStorage.getItem('filterSearch'))

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
          // 메인 카테고리와 함께 출력하기 위해 로직 구성
          if (props.data) { // 데이터가 로드되었는지 확인
            const findCategory = props.data.find((item) =>
              item.title.includes(resultSearch)
            );
            // 상위 카테고리를 찾으면 표시
            if (findCategory) {
              setSelectedCategory(findCategory.category.main);
            } else {
              setSelectedCategory('전체');
            }
          }
        } else {
          setFilterSearch("");
        }
      }
    }, [mainCategory, subCategory, resultSearch, props.categoryData, props.data]);

    // 찾은 카테고리에 따라 아이템 필터링
    useEffect(() => {
      // 상품이 렌더링 되었을 때만 진행
      if(props.data){
        // 조건 - 상위 카테고리가 '전체' (기본 값) 일 때
        if (selectedCategory === '전체'){
          const addCntList = props.data.map((item,index) => ({
            ...item,
            cnt: item.cnt ? item.cnt : 1,
            finprice : item.finprice ? item.finprice : item.price,
            listId : index,
          }));
          setFilteredItems(addCntList);
          return;
        }
        // 조건 - 검색 필터가 공백이 아닐때 (검색 했을 때)
        if (filterSearch !== "") {
          // 데이터에서 타이틀과 검색결과를 찾고
          const filtered = props.data.filter((item) =>
            item.title.includes(filterSearch))
          // 목록 밑작업 해줌
          const addCntList = filtered.map((item, index) => ({
            ...item,
            cnt: item.cnt ? item.cnt : 1,
            finprice: item.finprice ? item.finprice : item.price,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
        // 조건 - 검색 필터가 공백이면 ?
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
    }, [props.data, selectedCategory, selectedSubCategory, filterSearch]);

    const navigate = useNavigate();

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
  
    //수량
    const [count, setCount] = useState(1);
  
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);
  
    //Td 선택시 Modal State 변수
    const [selectedData, setSelectedData] = useState(null);
  
    //수정하기 state
    const [editStatus, setEditStatus] = useState(filteredItems.map(()=>false));
  
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));
    
    // 장바구니 복사
    const copyList = [...props.basketList];

    // userId가 같은 항목만 필터링
    const onlyUserData = copyList.filter((item)=> item.userId === inLogin.id);
  
    // 아이템 클릭 핸들러
    const handleItemClick = (itemId) => {
      if (selectedData === itemId) {
        // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
        setSelectedData(null);
      } else {
        setSelectedData(itemId);
      }
    };
    
  
    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
      const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return filteredItems.slice(startIndex, startIndex + 5);
    };
    
      // 체크박스 클릭 시 호출되는 함수
      function checkedBox(product) {
        if (selectedItems.includes(product)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
          setSelectedItems(selectedItems.filter((item) => item !== product)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
        } else {
          setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
        }
      };
  
    //수량 최대입력 글자(제한 길이 변수)
    const maxLengthCheck = (e) => { 
      const lengthTarget = e.target.value; 
      //target.value.length = input에서 받은 value의 길이 
      //target.maxLength = 제한 길이
  
      if ( lengthTarget >= 0 && lengthTarget.length <= 3) { 
          setCount(lengthTarget); 
      } 
  }
  
    //수정하기 버튼을 눌렀을 때 함수 작동(개수 세는 함수)
    function editItem(index){
      const newEditStatus = [...editStatus]; 
      newEditStatus[index] = true;
      setEditStatus(newEditStatus);
      setCount(filteredItems[index].cnt); 
    }
  
    //수정완료 버튼 눌렀을 때 함수 작동(개수 저장 함수)
    function updatedItem(index){
      if(count > 0) {
        filteredItems[index].cnt = count;
        filteredItems[index].finprice = filteredItems[index].price * count;
        const newEditStatus = [...editStatus]; 
        newEditStatus[index] = false;
        setEditStatus(newEditStatus);
      } else {
        alert("수량은 0보다 커야합니다.")
      }
    }
  

    // 장바구니 담기 함수
    function basketRelatedData() {
      // 유효성 체크
      if(!props.login){
        alert("로그인 후 이용가능한 서비스입니다.")
        navigate("/login");
        return;
      }
  
      if (selectedItems.length === 0) {
        alert("먼저 담을 상품을 체크해주세요!");
        return;
      }
    
      if (count <= 0) {
        alert("수량은 0보다 커야합니다.");
        return;
      }
    
      const isEditStatus = selectedItems.some((item, index) => editStatus[index]);
      if (isEditStatus) {
        alert("수정완료 버튼을 누르고 장바구니에 담아주세요.")
        return;
      }
  
    
      if (selectedItems.some((item) => 
      item.option && (optionSelected[item.listId] === undefined || optionSelected.length === 0))) {
      alert("필수 옵션을 선택해주세요!");
      return;
  }
    
      // 중복확인
      const selectedItemsInfo = selectedItems.map((item) => ({
        id: item.id,
        option: optionSelected[item.listId],
      }));
    
      const isDuplicate = selectedItemsInfo.some((selectedItemsInfo) =>
        onlyUserData.some((basketItem) =>
          basketItem.id === selectedItemsInfo.id &&
          basketItem.optionSelected === selectedItemsInfo.option
        )
      );
    
      if (isDuplicate) {
        const findDuplicate = onlyUserData.filter((item) =>
          selectedItemsInfo.some((selectedItemInfo) =>
            item.id === selectedItemInfo.id &&
            item.optionSelected === selectedItemInfo.option
          )
        );
    
        const duplicateTitles = findDuplicate.map((item) => item.title).join(", ");
        alert(`이미 장바구니에 추가된 상품이 있습니다. 
          (중복된 상품 : ${duplicateTitles})`);
        return;
      }
    
      // 옵션 선택한 경우에만 option 객체로 추가
      const basketProductsToAdd = selectedItems.map((item) => {
        if (item.option && optionSelected[item.listId] !== undefined) {
          return { ...item, userId: inLogin.id, optionSelected: optionSelected[item.listId] };
        }
        return {...item, userId: inLogin.id };
      });
    
      props.setBasketList([...props.basketList, ...basketProductsToAdd]);
    
      alert("해당 상품이 장바구니에 추가되었습니다.");
      setSelectedItems([]);
    }
    // 옵션 변경 함수
    function optionChange(e, index) {
      const newOptionSelected = [...optionSelected];
      newOptionSelected[index] = e.target.value;
      setOptionSelected(newOptionSelected);
    }

  // 카테고리 필터 부분
  
    // 중복 처리
    const isIncludeCategory = [...new Set(filteredItems.map((item) => item.category.sub ? item.category.sub : item.category.main))];
    const isIncludeBrands = [...new Set(filteredItems.map((item) => item.brand))];
    const isIncludeMaden = [...new Set(filteredItems.map((item) => item.madeIn))];

    // 카테고리 필터 구성
    const categoryFilter = [
      {
        label: '카테고리',
        prevContent : selectedCategory && selectedCategory,
        content: 
        isIncludeCategory ? 
        isIncludeCategory.map((category) => ({
          title : category,
          count : filteredItems.filter((item) => item.category.main === category).length > 0 
          ? filteredItems.filter((item) => item.category.main === category).length
          : filteredItems.filter((item) => item.category.sub === category).length,
        }))
        : '전체'
      },
      {
        label: '브랜드',
        content: isIncludeBrands.map((brand) => ({
          title: brand,
          count: filteredItems.filter((item) => item.brand === brand).length,
        }))
      },
      {
        label: '원산지',
        content: isIncludeMaden.map((madeIn) => ({
          title: madeIn,
          count: filteredItems.filter((item) => item.madeIn === madeIn).length,
        }))
      }
    ];
    // 카테고리 필터 클릭 시 진행 함수
    function handleCategoryClick(item, contentItem){
      let filtered;

      switch (item.label) {
        case '브랜드':
          filtered = filteredItems.filter((item) => item.brand === contentItem.title);
          break;
        case '원산지':
          filtered = filteredItems.filter((item) => item.madeIn === contentItem.title);
          break;
        case '카테고리':
          filtered = filteredItems.filter((item) => item.category.sub === contentItem.title);
          break;
        default:
          filtered = [];
      }
  
      const addCntList = filtered.map((item, index) => ({
        ...item,
        cnt: item.cnt ? item.cnt : 1,
        finprice : item.finprice ? item.finprice : item.price,
        listId : index,
      }));
  
      setFilteredItems(addCntList);
    };

    function prevContentClick(){
      if(selectedCategory === '전체'){
        const addCntList = props.data.map((item,index) => ({
          ...item,
          cnt: item.cnt ? item.cnt : 1,
          finprice : item.finprice ? item.finprice : item.price,
          listId : index,
        }));
        setFilteredItems(addCntList);
        return;
      }
      const filtered = props.data.filter((item) => item.category.main === selectedCategory);
      const addCntList = filtered.map((item,index) => ({
        ...item,
        cnt: item.cnt ? item.cnt : 1,
        finprice : item.finprice ? item.finprice : item.price,
        listId : index,
      }));
      setFilteredItems(addCntList);
    }
  return(
    <div>
      <TopBanner data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} 
      login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} 
      iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} 
      icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} 
      category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
        <div className={styles.topTitle}>
          <h1>카테고리</h1>
        </div>
        {resultSearch &&
        <h3 style={{margin: '1em'}}>
        "{resultSearch}" 에 대해
        <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
        이 검색 되었습니다.
        </h3>}
        {/* 카테고리 필터 */}
        <div className={styles.filterUI}>
          {categoryFilter.map((item, key) =>
          <React.Fragment key={key}>
          {/* 필터 별 라벨 */}
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {/* 상위 카테고리 항목 */}
            {item.prevContent &&
            <>
            <span
              className={styles.contentItem}
              onClick={()=> {
                prevContentClick();
              }}>
              {item.prevContent}
            </span>
            <i className="far fa-chevron-right"/>
            </>
            }
            {/* 하위 카테고리 항목 */}
            {item.content && Array.isArray(item.content)
            ? item.content.map((contentItem, index) => 
            <div 
            key={index} 
            className={styles.contentItem}
            onClick={()=> {
              handleCategoryClick(item, contentItem)
            }}>
              {contentItem.title}({contentItem.count})
            </div>
            ) 
            : item.content }
          </div>
          </React.Fragment>
          )}
        </div>
        {/* 카테고리 목록 TABLE */}
        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={()=> navigate("/basket")}>
            장바구니 이동
          </button>
          <button className={styles.button} onClick={()=> basketRelatedData()}>
            선택 항목 장바구니 추가
          </button>
        </div>
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
                    <h5>{item.title}</h5>
                  </td>
                  <td>EA</td>
                  <td>\{item.price}</td>
                  <td style={{fontWeight: '650'}}>
                    {item.finprice
                    ? item.discount
                    ? `\\${ item.finprice - (((item.price/100)*item.discount)*item.cnt)}`
                    : `\\${item.finprice}`
                    : item.price}
                  </td>
                  <td 
                    className={styles.detailView}
                    onClick={()=>handleItemClick(item.id)}>
                    [ 더보기&nbsp;{selectedData === item.id  
                    ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                    : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;]
                  </td>
                </tr>
                {/* 모달 */}
                {selectedData === item.id && (
                <tr>
                  <td colSpan="8">
                    <table className={styles.colTable}>
                      <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                        <tr>
                          <th style={{width: '15%'}}>
                            브랜드
                          </th>
                          <th style={{width: '15%'}}>
                            규격
                          </th>
                          <th style={{width: '10%'}}>
                            옵션
                          </th>
                          <th style={{width: '20%'}}>
                            개수
                          </th>
                          <th style={{width: '10%'}}>
                            적용률
                          </th>
                          <th style={{width: '10%'}}>
                            적용가
                          </th>
                          <th style={{width: '10%', fontWeight: '650'}}>
                            공급가
                          </th>
                          <th style={{width: '20%'}}>
                            <button className={styles.button} onClick={()=> basketRelatedData()}>장바구니 추가</button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {item.brand}
                          </td>
                          <td>
                            규격 정보
                          </td>
                          <td>
                            {item.option 
                            ?                   
                            <div style={{ width: '100%', display: 'flex', alignItems:'center', textAlign: 'center', justifyContent: 'center'}}>
                              <select 
                              value={optionSelected[index] || ""}
                              onChange={(e)=>{optionChange(e, index)}}
                              className={styles.selectSize}
                              >
                                <option value="" disabled>옵션 선택</option>
                                {item.option.map((item, index) =>
                                <option key={index} value={item.value}>{item.value}</option>
                                )}
                              </select>
                            </div>  : '없음'}
                          </td>
                          <td>
                          {!editStatus[index]
                          ? item.cnt
                          : <input value={count} className={styles.input} onChange={maxLengthCheck} minLength={1} maxLength={3} min={0} max={999} type='number' placeholder='숫자만 입력'/> }
                          <br/>
    
                          {!editStatus[index] 
                          ? <button
                            onClick={()=>{editItem(index)}} 
                            className={styles.editButton}
                            >개수 수정
                            </button> 
                          : <button 
                            className={styles.editButton}
                            onClick={()=>updatedItem(index)}
                            >수정 완료
                            </button>
                          }
                          </td>
                          <td>
                            {item.discount}%
                          </td>
                          <td style={{fontWeight: '650'}}>
                            {item.discount
                            ? `\\${((item.price/100)*item.discount)*item.cnt}`
                            : 0}
                          </td>
                          <td style={{fontWeight: '650'}}>
                          {item.finprice
                          ? item.discount
                          ? `\\${ item.finprice - (((item.price/100)*item.discount)*item.cnt)}`
                          : `\\${item.finprice}`
                          : item.price}
                          </td>
                          <td>
                            <input 
                              checked={selectedItems.includes(item)}
                              onChange={() => checkedBox(item)}
                              type='checkbox'
                            />   
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
  )
}