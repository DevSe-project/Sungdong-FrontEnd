import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
import { useListActions, useSearchActions, useSearchFilterData, useSearchList, useSearchStore, useSearchTerm, useSeperateSearchTerm } from "../../../Store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryFilter } from "./CategoryFilter";
import { useFetch } from "../../../customFn/useFetch"
import Pagination from "../../../customFn/Pagination";
export function Category() {
  const seperateSearchTerm = useSeperateSearchTerm();
  const { setFilterData } = useSearchActions();
  const searchList = useSearchList();
  const navigate = useNavigate();
  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);
  const { setSearchList, resetSearchList, setSearchCnt, setSearchCntUp, setSearchCntDown, setSearchOption } = useListActions();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postCnt, setPostCnt] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  //검색 결과 데이터 fetch
  const { fetchAddPostServer, fetchServer } = useFetch();
  const [filteredProductList, setFilteredProductList] = useState([]);

  // 필터링된 상품 리스트 초기화
  useEffect(() => {
    setFilteredProductList(searchList);
  }, [searchList]);

  const fetchSearchData = async () => {
    const getSearch = JSON.parse(sessionStorage.getItem('searchTerm'));
    const data = await fetchAddPostServer([getSearch.state.searchTerm, getSearch.state.seperateSearchTerm], 'post', '/search/list', 1, postCnt);
    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    setPostCnt(data.data.postsPerPage);
    setTotalRows(data.data.totalRows);
    setFilterData(data.data.datas);

    return data.data;
  }

  const { isLoading, isError, error, data: product } = useQuery({ queryKey: ['search'], queryFn: () => fetchSearchData() });

  //product가 마운트 되면 searchList에 담음(cnt등을 위함)
  useEffect(() => {
    function fetchData() {
      if ((product && searchList.length === 0) || (product && product.data.map(item => searchList.length > 0 && searchList.map(list => item !== list)))) {
        resetSearchList();
        setSearchList(product.data);
      }
    };

    fetchData();
  }, [product])

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
    const getSearch = JSON.parse(sessionStorage.getItem('searchTerm'));
    return await fetchAddPostServer([getSearch.state.searchTerm, getSearch.state.seperateSearchTerm], 'post', '/search/list', pageNumber, postCnt);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        setPostCnt(data.data.postsPerPage);
        setTotalRows(data.data.totalRows);
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
      if (product) {
        setCurrentPage(product.currentPage);
        setTotalPages(product.totalPages);
        setPostCnt(product.postsPerPage);
        setTotalRows(product.totalRows);
      }
    };

    fetchData();
  }, [product])

  //------------------------------------------------------

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.product_id === product.product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.product_id !== product.product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
    }
    console.log(selectedItems)
  };

  const optionCreator = (item) => {
    let options = [];
    for (let i = 0; i < 10; i++) {
      options.push(item[`option${i}`])
    }
    return (
      <select value={item.selectedOption} onChange={(e) => setSearchOption(item, e.target.value)}>
        <option value="">
          선택
        </option>
        {options.length > 0 && options.map((option, key) => {
          return (
            option !== "" &&
            <option key={key} value={option}>
              {(option !== null || option !== "") && option}
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
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        setSearchCnt(prevItem, lengthTarget);
      } else {
        setSearchCnt(prevItem, lengthTarget);
      }
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    if (prevItem.cnt > 1) {
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        setSearchCntDown(prevItem);
      }
      else {
        setSearchCntDown(prevItem);
      }
    } else {
      alert("수량은 1보다 커야합니다.");
      return prevItem; // 1이하로 내릴 수 없으면 기존 아이템 반환
    }
  }


  // 수량 UP
  function handleAddItem(prevItem) {
    if (prevItem.cnt < 999) {
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        setSearchCntUp(prevItem);
      } else {
        setSearchCntUp(prevItem);
      }
    } else {
      alert("수량은 999보다 작아야합니다.");
      return prevItem; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
    }
  }
  //-------------------장바구니 담기------------------------

  //장바구니 추가 함수
  const addToCart = async (product) => {
    return await fetchServer(product, `post`, `/cart/create`, 1)
  };

  //장바구니 추가 함수
  const { mutate: basketMutation } = useMutation({ mutationFn: addToCart });

  function basketRelatedData() {
    if (selectedItems.length === 0) {
      alert("먼저 담을 상품을 체크해주세요!");
      return;
    }

    if (selectedItems.some((item) =>
      item.option0 !== '' && (item.selectedOption === undefined || item.selectedOption === null || item.selectedOption === ''))) {
      alert("필수 옵션을 선택해주세요!");
      return;
    }

    basketMutation(selectedItems, {
      onSuccess: (cartData) => {
        // 메세지 표시
        alert(cartData.message);
        console.log('상품이 장바구니에 추가되었습니다.', cartData);
        // 장바구니 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['cart']);
        // 장바구니로 이동
        navigate("/basket");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    })// 상품을 장바구니에 추가하는 것을 호출    
  }

  //--- 검색결과 알림문 ---

  function searchRender() {
    const searchTermText = [];

    if (seperateSearchTerm.product_title !== '') {
      searchTermText.push(`상품명: ${seperateSearchTerm.product_title}`);
    }

    if (seperateSearchTerm.product_id !== '') {
      searchTermText.push(`상품코드: ${seperateSearchTerm.product_id}`);
    }

    if (seperateSearchTerm.product_brand !== '') {
      searchTermText.push(`브랜드: ${seperateSearchTerm.product_brand}`);
    }

    if (seperateSearchTerm.product_spec !== '') {
      searchTermText.push(`규격: ${seperateSearchTerm.product_spec}`);
    }

    if (seperateSearchTerm.product_model !== '') {
      searchTermText.push(`모델명: ${seperateSearchTerm.product_model}`);
    }
    return (
      <span>{searchTermText.length > 0 ? <><span style={{ color: '#CC0000', fontWeight: 'bolder' }}>"{searchTermText.join(' 및 ')}"</span>에 대하여</> : '검색 조건이 없습니다.'}</span>
    )
  }

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.main}>
      <div className={styles.topTitle}>
        <h1>검색 결과</h1>
      </div>
      <CategoryFilter filteredProductList={filteredProductList} setFilteredProductList={setFilteredProductList} postCnt={postCnt} setCurrentPage={setCurrentPage} setTotalPages={setTotalPages} setPostCnt={setPostCnt} setTotalRows={setTotalRows} />
      <h5 style={{ margin: '1em' }}>
        {searchRender()}
        <span style={{ color: '#CC0000', fontWeight: '650', margin: '0.5em' }}>{product ? filteredProductList.length : 0}건<span style={{ color: 'black' }}>이 검색 되었습니다.</span></span>
      </h5>
      {/* 카테고리 목록 TABLE */}
      <div className={styles.buttonBox}>
        <button className={styles.button} onClick={() => navigate("/basket")}>
          장바구니 이동
        </button>
        <button className={styles.button} onClick={() => basketRelatedData()}>
          선택 항목 장바구니 추가
        </button>
      </div>
      {/* 카테고리 결과 List */}
      <div className={styles.tableLocation}>
        <table className={styles.table}>
          <thead
            style={{ height: '5em', backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            <tr>
              <th rowSpan={2}>이미지</th>
              <th>상품코드</th>
              <th>품명</th>
              <th>브랜드</th>
              <th>단위</th>
              <th>표준가</th>
              <th style={{ fontWeight: '650' }}>공급단가</th>
              <th rowSpan={2}>수량</th>
              <th rowSpan={2}><input type='checkbox' disabled /></th>
            </tr>
            <tr>
              <th>규격</th>
              <th>모델명</th>
              <th>옵션</th>
              <th>적용률</th>
              <th>할인금액</th>
              <th>공급가</th>
            </tr>
          </thead>
          <tbody>
            {product && searchList && filteredProductList.map((item, index) => (
              <React.Fragment key={index}>
                <tr className={styles.list}>
                  <td rowSpan={2}><img className={styles.thumnail} src={item.product_image_original} alt='이미지'></img></td>
                  <td>{item.product_id}</td>
                  <td
                    className={styles.detailView}
                    style={{ fontSize: '1.1em', fontWeight: '550' }}
                    onClick={() => navigate(`/detail/${item.product_id}`)}>
                    {item.product_title}
                  </td>
                  <td>
                    <h5>{item.product_brand}</h5>
                  </td>
                  <td>EA</td>
                  <td>
                    {item.product_discount
                      ? `${parseInt(item.product_price)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ fontWeight: '750' }}>
                    {item.product_discount
                      ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td style={{ width: '15%' }} rowSpan={2}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleDelItem(item)}
                    >
                      -
                    </button>
                    <input value={item.cnt ? item.cnt : item.cnt = 1} className={styles.input} onChange={(e) => maxLengthCheck(e, item)} type='text' placeholder='숫자만 입력' />
                    <button
                      className={styles.editButton}
                      onClick={() => handleAddItem(item)}
                    >
                      +
                    </button>
                  </td>
                  <td rowSpan={2}>
                    <input
                      checked={selectedItems.includes(item)}
                      onChange={() => checkedBox(item)}
                      type='checkbox'
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {item.product_spec}
                  </td>
                  <td>
                    {item.product_model}
                  </td>
                  <td>
                    {item.option0 === '' ? <span>옵션없음</span> : optionCreator(item)}
                  </td>
                  <td>
                    {item.product_discount}%
                  </td>
                  <td style={{ fontWeight: '550' }}>
                    {item.product_discount
                      ? `${(((item.product_price / 100) * item.product_discount) * (item.cnt ? item.cnt : 1))
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : parseInt('0').toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ fontWeight: '750' }}>
                    {item.product_discount
                      ? `${((item.product_price * (item.cnt ? item.cnt : 1)) - ((item.product_price / 100) * item.product_discount) * (item.cnt ? item.cnt : 1))
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.product_price * (item.cnt ? item.cnt : 1)).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                </tr>
              </React.Fragment>
            ))
            }
          </tbody>
        </table>
      </div>

      {/* 페이지 컨테이너 */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}