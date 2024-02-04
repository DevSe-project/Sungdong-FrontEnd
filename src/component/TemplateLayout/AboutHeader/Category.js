import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
import { useCartList, useCategoryData, useListActions, useSearchActions, useSearchStore, useSeperateSearchTerm } from "../../../Store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryFilter } from "./CategoryFilter";
import { useFetch} from "../../../customFn/useFetch"
import Pagination from "../../../customFn/Pagination";
export function Category(){
  const seperateSearchTerm = useSeperateSearchTerm();
  const {resetSeperateSearchTerm} = useSearchActions();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postCnt, setPostCnt] = useState(5);
  //검색 결과 데이터 fetch
  const {fetchGetAddPostServer, fetchAddPostServer, fetchServer } = useFetch();

  const fetchSearchData = async() => {
    const data = await fetchAddPostServer(seperateSearchTerm, 'post', '/search/list', currentPage, postCnt);

    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    return data.data;
  }
  
  const { isLoading, isError, error, data:product } = useQuery({queryKey: ['search'], queryFn: ()=> fetchSearchData()});
  
  //-------------------------페이지 설정------------------------------


  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 검색창 상태 리셋
      useSearchStore.persist.clearStorage();
      window.location.reload();
    };
  }, []);

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchAddPostServer(seperateSearchTerm, 'post', '/search/list', pageNumber, postCnt);
  };


  const {mutate:pageMutaion} = useMutation({mutationFn: fetchPageChange})


  function handlePageChange(pageNumber){
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['search'], () => {
          return data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }
    
    const queryClient = useQueryClient();

    //마운트 될때 페이지 설정.
    useEffect(() => {
      const fetchData = async () => {
        if(product){
          setCurrentPage(product.currentPage);
          setTotalPages(product.totalPages);
        }
      };
  
      fetchData();
    }, [product])

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
    const [filterSearch, setFilterSearch] = useState("");
    
    // 필터된 항목을 저장할 상태 변수
    const [filteredItems, setFilteredItems] = useState([]);

    const navigate = useNavigate();
    
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);
  
    //Td 선택시 Modal State 변수
    const [selectedData, setSelectedData] = useState(null);
    
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));

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
        basketMutation(selectedItems);
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
        <h1>검색 결과</h1>
      </div>
      <h3 style={{margin: '1em'}}>
      {/* 상품명 : {categoryData.search.name}, 상품코드 : {categoryData.search.code}
      , 브랜드 : {categoryData.search.brand} 옵션 : {categoryData.search.option}*/}
      {/* categoryData.items.length */}
      <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{product ? product.data.length : 0}건</span>
      이 검색 되었습니다.
      </h3>
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
          {product && product.data.map((item, index)=> (
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
              {selectedData === item.product_id && (
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