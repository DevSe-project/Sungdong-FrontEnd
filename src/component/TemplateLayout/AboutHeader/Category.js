import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
import { useBasketList, useCategoryData, useIsLogin, useListActions } from "../../../Store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CategoryFilter } from "./CategoryFilter";
export function Category(props){
  //검색 결과 데이터 fetch
    const fetchSearchData = async() => {
      try{
        const response = await axios.get("/search", 
          {
            headers : {
              "Content-Type" : "application/json"
            }
          }
        )
        return response.data; //data.search & data.items & data.categories 전달받음.
      } catch(error) {
        throw new Error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
      }
    }

    // state 사용
    const { isLoading, isError, error, data } = useQuery({queryKey:['data']});
    //const { isLoading, isError, error, data:categoryData } = useQuery({queryKey:['search'], queryFn: ()=> fetchSearchData();});
    
    const queryClient = useQueryClient();

    //장바구니 추가 함수
    const addToCart = async (product) => {
      if (isLoading) {
        // 데이터가 없으면 아무것도 하지 않고 종료
        return;
      }
      try {
        const response = await axios.post("/cart", 
          JSON.stringify({
            productId: product.id,  // 예시: product가 객체이고 id 속성이 있는 경우
            optionSelect: product.optionSelect,
            cnt: product.cnt,
          }),
          {
            headers : {
              "Content-Type" : "application/json"
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.');
      }
    };
  


    //장바구니 추가 함수
    const { basketMutation } = useMutation({mutationFn: addToCart,
      onSuccess: (cartData) => {
        // 메세지 표시
        alert(cartData.message);
        console.log('상품이 장바구니에 추가되었습니다.', cartData);
        // 장바구니 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['cart']);
        // 선택된 아이템들 초기화
        setSelectedItems([]);
        // 장바구니로 이동
        navigate("/basket");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    })


    const categoryData = useCategoryData();
    const isLogin = useIsLogin();
    const basketList = useBasketList();
    const { setBasketList } = useListActions();
    
    // 카테고리
    const [selectedCategory, setSelectedCategory] = useState('전체'); //메인 카테고리
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); //서브 카테고리
    const [filterSearch, setFilterSearch] = useState("");
    
    // 필터된 항목을 저장할 상태 변수
    const [filteredItems, setFilteredItems] = useState([]);

    const inLogin = JSON.parse(sessionStorage.getItem('saveLoginData'));
    const mainCategory = JSON.parse(sessionStorage.getItem('category'));
    const subCategory = JSON.parse(sessionStorage.getItem('subCategory'));
    const resultSearch = JSON.parse(sessionStorage.getItem('filterSearch'));
    const resultSearchBrand = JSON.parse(sessionStorage.getItem('filterSearchBrand'));
    const resultSearchCode = JSON.parse(sessionStorage.getItem('filterSearchCode'));
    const resultSearchOption = JSON.parse(sessionStorage.getItem('filterSearchOption'));

    const navigate = useNavigate();

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
    
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);
  
    //Td 선택시 Modal State 변수
    const [selectedData, setSelectedData] = useState(null);
    
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));
    
    // 장바구니 복사
    const copyList = [...basketList];

    // userId가 같은 항목만 필터링
    const onlyUserData = copyList.filter((item)=> item.userId === inLogin.id);
  

    // ------------------카테고리 찾기 - mainCategory와 subCategory가 바뀔 때 마다 실행
    useEffect(() => {
      //categoryData가 있을 때만 진행
      if (categoryData) {
        if (mainCategory) {
          setSelectedCategory(mainCategory);
        }
        // 메인 카테고리와 함께 출력하기 위해 로직 구성
        if (subCategory) {
          const findCategory = categoryData.find((item) =>
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
        if (data) { // 데이터가 로드되었는지 확인
          // 필터링 로직
            const findCategory = data.find((item) => item.title.includes(resultSearch));
            if(findCategory) {
              setSelectedCategory(findCategory.category.main);
            } else {
              setSelectedCategory('전체');
            }
          }
        } else if (resultSearchBrand) {
          setFilterSearch(resultSearchBrand);
          if (data) { // 데이터가 로드되었는지 확인
            // 필터링 로직
              const findCategory = data.find((item) => item.brand.includes(resultSearchBrand));
              if(findCategory) {
                setSelectedCategory(findCategory.category.main);
              } else {
                setSelectedCategory('전체');
              }
            }
        } else if (resultSearchCode) {
          setFilterSearch(resultSearchCode);
          if (data) { // 데이터가 로드되었는지 확인
            // 필터링 로직
              const findCategory = data.find((item) => item.id.toString().includes(resultSearchCode.toString()));
              if(findCategory) {
                setSelectedCategory(findCategory.category.main);
              } else {
                setSelectedCategory('전체');
              }
            }
          } else if (resultSearchOption) {
            setFilterSearch(resultSearchOption);
            if (data) { // 데이터가 로드되었는지 확인
              // 필터링 로직
                const findCategory = data.find((item) => item.option&& item.option.some((item) => item.value.includes(resultSearchOption)));
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
    }, [mainCategory, subCategory, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption, categoryData, data]);

    // 찾은 카테고리에 따라 아이템 필터링
    useEffect(() => {
  // 상품이 렌더링 되었을 때만 진행
  if (data) {
    // 조건 - 상위 카테고리가 '전체' (기본 값) 일 때
    if (selectedCategory === '전체') {
      const addCntList = data.map((item, index) => ({
        ...item,
        listId: index,
      }));
      setFilteredItems(addCntList);
      return;
    }
    
    // 조건 - 검색 필터가 공백이 아닐때 (검색 했을 때)
    if (filterSearch !== "") {
      // 데이터에서 검색결과를 포함하는 대상 찾기
      if (resultSearch) {
        const findCategory = data.filter((item) => item.title.includes(resultSearch));
        const addCntList = findCategory.map((item, index) => ({
          ...item,
          listId: index,
        }));
        // 필터링 된 아이템 표시
        setFilteredItems(addCntList);
        return;
        } else if (resultSearchBrand) {
          const findCategory = data.filter((item) => item.brand.includes(resultSearchBrand));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
        } else if (resultSearchCode) {
          const findCategory = data.filter((item) => item.id.toString().includes(resultSearchCode));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
        } else if (resultSearchOption) {
          const findCategory = data.filter((item) => item.option&& item.option.some((item)=>item.value.includes(resultSearchOption)));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
        }
      } else {
        // 조건(2) - 서브 카테고리를 null이 아닐때, 즉 서브 카테고리가 있을 때
        if(selectedSubCategory !== null){
          const filtered = data.filter((item) => item.category.sub === selectedSubCategory);
          const addCntList = filtered.map((item,index) => ({
            ...item,
            listId : index,
          }));
          setFilteredItems(addCntList);
        // 상위 카테고리만 선택했을 때
        } else if(selectedSubCategory === null){
          const filtered = data.filter((item) => item.category.main === selectedCategory);
          const addCntList = filtered.map((item,index) => ({
            ...item,
            listId : index,
          }));
          setFilteredItems(addCntList);
        } 
      }
    }
  }, [data, selectedCategory, selectedSubCategory, filterSearch, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption]);

//------------------------------------------------------

    // 아이템 클릭 모달 핸들러
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
      //return categoryData.items.slice(startIndex, startIndex + 5);
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
// --------- 수량 변경 부분 ----------
  
  // 수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e, prevItem) => {
    const lengthTarget = e.target.value;

    if (lengthTarget >= 0 && lengthTarget.length <= 3) {
      const updatedItems = filteredItems.map((item) => {
        if (item.id === prevItem.id) {  
          return { ...item, cnt: lengthTarget };
        }
      return item; // 다른 아이템은 그대로 반환
      });
      setFilteredItems(updatedItems);
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    const updatedItems = filteredItems.map((item) => {
      if (item.id === prevItem.id) {
        if (item.cnt > 1) {
          return { ...item, cnt: parseInt(item.cnt) - 1 };
        } else {
          alert("수량은 1보다 커야합니다.");
          return item; // 1이하로 내릴 수 없으면 기존 아이템 반환
        }
      }
      return item; // 다른 아이템은 그대로 반환
    });

    setFilteredItems(updatedItems);
  }
    

  // 수량 UP
  function handleAddItem(prevItem) {
    const updatedItems = filteredItems.map((item) => {
      if (item.id === prevItem.id) {
        if (item.cnt < 999) {
          return { ...item, cnt: parseInt(item.cnt) + 1 };
        } else {
          alert("수량은 999보다 작아야합니다.");
          return item; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
        }
      }
      return item; // 다른 아이템은 그대로 반환
    });

    setFilteredItems(updatedItems);
  }
  //-------------------장바구니 담기------------------------
    function basketRelatedData() {
      try{
        basketMutation(selectedItems);
      } catch(error) {
        // 유효성 체크
        if(!isLogin){
          alert("로그인 후 이용가능한 서비스입니다.")
          navigate("/login");
          return;
        }
    
        if (selectedItems.length === 0) {
          alert("먼저 담을 상품을 체크해주세요!");
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
      
        setBasketList([...basketList, ...basketProductsToAdd]);
      
        alert("해당 상품이 장바구니에 추가되었습니다.");
        setSelectedItems([]);
      }
    }
  //----------------------------------------------------------------

    // 옵션 변경 함수
    function optionChange(e, index) {
      const newOptionSelected = [...optionSelected];
      newOptionSelected[index] = e.target.value;
      setOptionSelected(newOptionSelected);
    }

  // -------------------카테고리 필터 부분----------------------
  
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
        listId : index,
      }));
  
      setFilteredItems(addCntList);
    };

    function prevContentClick(){
      if(selectedCategory === '전체'){
        const addCntList = data.map((item,index) => ({
          ...item,
          listId : index,
        }));
        setFilteredItems(addCntList);
        return;
      }
      const filtered = data.filter((item) => item.category.main === selectedCategory);
      const addCntList = filtered.map((item,index) => ({
        ...item,
        listId : index,
      }));
      setFilteredItems(addCntList);
    }

    if(isLoading){
      return <p>Loading..</p>;
    }
    if(isError){
      return <p>에러 : {error.message}</p>;
    }
  return(
    <div className={styles.main}>
      <div className={styles.topTitle}>
        <h1>카테고리</h1>
      </div>
      {(resultSearch || resultSearchBrand || resultSearchCode || resultSearchOption) &&
      <h3 style={{margin: '1em'}}>
      {/* 상품명 : {categoryData.search.name}, 상품코드 : {categoryData.search.code}
      , 브랜드 : {categoryData.search.brand} 옵션 : {categoryData.search.option}*/}
      "{resultSearch || resultSearchBrand || resultSearchCode || resultSearchOption}" 에 대해
      {/* categoryData.items.length */}
      <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
      이 검색 되었습니다.
      </h3>}
      {/* 카테고리 필터 */}
        <CategoryFilter categoryFilter={categoryFilter} prevContentClick={prevContentClick} handleCategoryClick={handleCategoryClick}/>
      {/* 카테고리 목록 TABLE */}
      <div className={styles.buttonBox}>
        <button className={styles.button} onClick={()=> navigate("/basket")}>
          장바구니 이동
        </button>
        <button className={styles.button} onClick={()=> basketRelatedData()}>
          선택 항목 장바구니 추가
        </button>
      </div>
      {/* 카테고리 결과 List */}
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
              <th style={{fontWeight: '650'}}>공급단가</th>
              <th>더보기</th>
            </tr>
          </thead>
          <tbody>
            {data 
            ? filteredItems.length > 0
            ? getCurrentPagePosts().map((item, index)=> ( // 현재 filteredItems로 맵핑중
            <React.Fragment key={index}>
              <tr className={styles.list}>
                {/* 이미지 */}
                <td><img src={item.image.mini} alt='이미지'></img></td>
                {/* 상품코드 */}
                <td>{item.id}</td>
                {/* 상세보기 */}
                <td 
                  className={styles.detailView}
                  onClick={()=>navigate(`/detail/${item.id}`)}>
                  상세보기
                </td>
                {/* 상품명 */}
                <td className={styles.detailView} onClick={()=>handleItemClick(item.id)}>
                  <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.title}</h5>
                </td>
                {/* 상품 수량 */}
                <td>EA</td>
                {/* 상품 표준가 */}
                <td>\{item.price.toLocaleString()}</td>
                {/* 상품 공급단가 */}
                <td style={{fontWeight: '750'}}>
                  {item.discount
                  ? `\\${ (item.price - (((item.price/100)*item.discount))).toLocaleString()}`
                  : `\\${item.price.toLocaleString()}`}
                </td>
                {/* 더보기 */}
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
                  <table className={styles.modalTr}>
                    <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                      <tr>
                        <th style={{width: '25%'}}>
                          브랜드
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
                          할인금액
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
                        {/* 수량 변경 */}
                        <td className={styles.countTd}>
                          <button 
                          className={styles.editButton}
                          onClick={()=>handleDelItem(item)}
                          >
                            -
                          </button>                          
                          <input value={item.cnt} className={styles.input} onChange={(e)=>maxLengthCheck(e,item)} type='text' placeholder='숫자만 입력'/>
                          <button 
                          className={styles.editButton}
                          onClick={()=>handleAddItem(item)}
                          >
                            +
                          </button>
                        </td>
                        <td>
                          {item.discount}%
                        </td>
                        <td style={{fontWeight: '750'}}>
                          {item.discount
                          ? `\\${(((item.price/100)*item.discount)*item.cnt.toLocaleString())}`
                          : 0}
                        </td>
                        <td style={{fontWeight: '750'}}>
                        {item.discount
                        ? `\\${ ((item.price * item.cnt) - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                        : `\\${(item.price * item.cnt).toLocaleString()}`}
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

      {/* 페이지 컨테이너 */}
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