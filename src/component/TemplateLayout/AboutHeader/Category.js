import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
import { useCartList, useCategoryData, useIsLogin, useListActions } from "../../../Store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryFilter } from "./CategoryFilter";
import { useFetch} from "../../../customFn/useFetch"
import Pagination from "../../../customFn/Pagination";
import { GetCookie } from "../../../customFn/GetCookie";
export function Category(){

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postCnt, setPostCnt] = useState(5);
  //검색 결과 데이터 fetch
  const {fetchGetAddPostServer, fetchAddPostServer, fetchServer } = useFetch();
  const fetchSearchData = async() => {
    const data = await fetchGetAddPostServer(`/search/list`, currentPage, postCnt);

    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  }
  
  const { isLoading, isError, error, data:product } = useQuery({queryKey: ['search'], queryFn: ()=> fetchSearchData()});

  //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchAddPostServer({}, 'post', '/search/list', pageNumber, postCnt);
  };


  const {mutate:pageMutaion} = useMutation({mutationFn: fetchPageChange})


  function handlePageChange(pageNumber){
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['search'], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

    //처음 마운트 될때 페이지 설정.
    useEffect(() => {
      const fetchData = async () => {
          const data = await fetchGetAddPostServer('/search/list', currentPage, postCnt);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
      };
  
      fetchData();
    }, [])

    
    const queryClient = useQueryClient();

//---------------------------- 장바구니 추가 관련 -----------------------

    //장바구니 추가 함수
    const addToCart = async (product) => {
      fetchServer(product, 'post', '/cart/create', 1)
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
    const cartList = useCartList();
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
    
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);
  
    //Td 선택시 Modal State 변수
    const [selectedData, setSelectedData] = useState(null);
    
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));
  

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
        if (product) { // 데이터가 로드되었는지 확인
          // 필터링 로직
            const findCategory = product.find((item) => item.title.includes(resultSearch));
            if(findCategory) {
              setSelectedCategory(findCategory.category.main);
            } else {
              setSelectedCategory('전체');
            }
          }
        } else if (resultSearchBrand) {
          setFilterSearch(resultSearchBrand);
          if (product) { // 데이터가 로드되었는지 확인
            // 필터링 로직
              const findCategory = product.find((item) => item.brand.includes(resultSearchBrand));
              if(findCategory) {
                setSelectedCategory(findCategory.category.main);
              } else {
                setSelectedCategory('전체');
              }
            }
        } else if (resultSearchCode) {
          setFilterSearch(resultSearchCode);
          if (product) { // 데이터가 로드되었는지 확인
            // 필터링 로직
              const findCategory = product.find((item) => item.id.toString().includes(resultSearchCode.toString()));
              if(findCategory) {
                setSelectedCategory(findCategory.category.main);
              } else {
                setSelectedCategory('전체');
              }
            }
          } else if (resultSearchOption) {
            setFilterSearch(resultSearchOption);
            if (product) { // 데이터가 로드되었는지 확인
              // 필터링 로직
                const findCategory = product.find((item) => item.option&& item.option.some((item) => item.value.includes(resultSearchOption)));
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
    }, [mainCategory, subCategory, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption, categoryData, product]);

    // 찾은 카테고리에 따라 아이템 필터링
    useEffect(() => {
  // 상품이 렌더링 되었을 때만 진행
  if (product) {
    // 조건 - 상위 카테고리가 '전체' (기본 값) 일 때
    if (selectedCategory === '전체') {
      const addCntList = product.map((item, index) => ({
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
        const findCategory = product.filter((item) => item.title.includes(resultSearch));
        const addCntList = findCategory.map((item, index) => ({
          ...item,
          listId: index,
        }));
        // 필터링 된 아이템 표시
        setFilteredItems(addCntList);
        return;
        } else if (resultSearchBrand) {
          const findCategory = product.filter((item) => item.brand.includes(resultSearchBrand));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
        } else if (resultSearchCode) {
          const findCategory = product.filter((item) => item.id.toString().includes(resultSearchCode));
          const addCntList = findCategory.map((item, index) => ({
            ...item,
            listId: index,
          }));
          // 필터링 된 아이템 표시
          setFilteredItems(addCntList);
          return;
        } else if (resultSearchOption) {
          const findCategory = product.filter((item) => item.option&& item.option.some((item)=>item.value.includes(resultSearchOption)));
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
          const filtered = product.filter((item) => item.category.sub === selectedSubCategory);
          const addCntList = filtered.map((item,index) => ({
            ...item,
            listId : index,
          }));
          setFilteredItems(addCntList);
        // 상위 카테고리만 선택했을 때
        } else if(selectedSubCategory === null){
          const filtered = product.filter((item) => item.category.main === selectedCategory);
          const addCntList = filtered.map((item,index) => ({
            ...item,
            listId : index,
          }));
          setFilteredItems(addCntList);
        } 
      }
    }
  }, [product, selectedCategory, selectedSubCategory, filterSearch, resultSearch, resultSearchBrand, resultSearchCode, resultSearchOption]);

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

    const optionCreator = (item) => {
      let options = [];
      for(let i = 0; i<10; i++){
        options.push(item[`option${i}`])
      }
      return(
        <select>
        {options.length > 0 && options.map((option, key) => {
        return (
          option !== "" &&
            <option key={key} value={option}>
              {(option !== null || option !== "" )&& option}
            </option>
          )
        })}
        </select>
      )
    }
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
        if(GetCookie !== null){
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
          cartList.some((basketItem) =>
            basketItem.id === selectedItemsInfo.id &&
            basketItem.optionSelected === selectedItemsInfo.option
          )
        );
      
        if (isDuplicate) {
          const findDuplicate = cartList.filter((item) =>
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
      
        setBasketList([...cartList, ...basketProductsToAdd]);
      
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
    const isIncludeCategory = [...new Set(filteredItems.map((item) => item.category_id ? item.category_id : item.partentsCategory_id))];
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
        const addCntList = product.map((item,index) => ({
          ...item,
          listId : index,
        }));
        setFilteredItems(addCntList);
        return;
      }
      const filtered = product.filter((item) => item.category.main === selectedCategory);
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
            <th style={{fontWeight: '650'}}>공급가</th>
            <th>더보기</th>
          </tr>
        </thead>
        <tbody>
          {product && product.map((item, index)=> (
          <React.Fragment key={index}>
            <tr className={styles.list}>
              <td><img src={item.product_image_mini} alt='이미지'></img></td>
              <td>{item.product_id}</td>
              <td 
                className={styles.detailView}
                onClick={()=>navigate(`/detail/${item.product_id}`)}>
                상세보기
              </td>
              <td className={styles.detailView} onClick={()=>handleItemClick(item.product_id)}>
                <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.product_title}</h5>
              </td>
              <td>EA</td>
              <td>
                {item.product_discount
                ? `${parseInt(item.product_price)
                  .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                : parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
              </td>
              <td style={{fontWeight: '750'}}>
              {item.product_discount
                ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                  .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
              </td>
              <td 
                className={styles.detailView}
                onClick={()=>handleItemClick(item.product_id)}>
                더보기&nbsp;{selectedData === item.product_id  
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
                              {item.product_brand}
                            </td>
                            <td>
                              {optionCreator(item)}
                            </td>
                            <td>
                              {item.product_supply}
                            </td>
                            <td>
                              {item.product_discount}%
                            </td>
                            <td style={{fontWeight: '550'}}>
                              {item.product_discount
                              ? `${((item.product_price / 100) * item.product_discount)
                              .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                              : parseInt('0').toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                            </td>
                            <td style={{fontWeight: '750'}}>
                            {item.product_discount
                              ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                                .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                              : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
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
                }
              </tbody>
            </table>
          </div>

      {/* 페이지 컨테이너 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
    </div>
  )
}