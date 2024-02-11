import { useState } from 'react';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { AdminProductFilter}  from '../Product/AdminProductFilter';
import React from 'react';
import styles from './AdminProductList.module.css';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProductFilter } from '../../../store/DataStore';
import axios from '../../../axios';
export function AdminProductList(){
  
  //Td 선택시 Modal State 변수
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();

  const productFilter = useProductFilter();

  const queryClient = useQueryClient();

  //데이터 불러오기
  const { isLoading, isError, error, data } = useQuery({queryKey:['data']});

  // 아이템 수정 핸들러
  function handleEditItem(item) {
    navigate(`/adminMain/editProduct/${item.product_id}`);
  }


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
    return data.slice(startIndex, startIndex + 5);
  };

  const fetchFilteredProducts = async (filter) => {
    try {
      const response = await axios.get(`/product`, { params: filter });
      return response.data;
    } catch (error) {
      throw new Error('상품 데이터를 불러오던 중 오류가 발생했습니다.');
    }
  };

  const fetchDeletedProducts = async(productId) => {
    try {
      const response = await axios.delete(`/product/delete/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 상품 삭제를 처리하는 뮤테이션
  const {mutate:deleteProductMutation} = useMutation({mutationFn: fetchDeletedProducts})


  const handleSearch = () => {
    // 검색 버튼 클릭 시에만 서버에 요청
    fetchFilteredProducts(productFilter);
  };

  const handleDeleted = (item) => {
    const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
    if(isConfirmed){
      deleteProductMutation(item.product_id,{
        onSuccess: (data) => {
          alert(data.message);
          // 상품 삭제 성공 시 상품 목록을 다시 불러옴
          queryClient.invalidateQueries(['data']);
        },
        onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          console.error('상품을 삭제 처리하는 중 오류가 발생했습니다.', error);
        },
      });
    }
  }

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



  // const { data:filteredData, isLoading, isError } = useQuery(['filteredProducts', productFilter], () => fetchFilteredProducts(productFilter));

  if(isLoading){
    return <p>Loading..</p>;
  }
  if(isError){
    return <p>에러 : {error.message}</p>;
  }

  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <div className={styles.container}>
          <div className={styles.bodyHeader}>
            <h1>상품 조회</h1>
          </div>
          <AdminProductFilter handleSearch={handleSearch}/>
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
                {data && getCurrentPagePosts().map((item, index)=> (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><img src={item.product_image_original} alt='이미지'></img></td>
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
                            <th>
                              <button className={styles.button} onClick={()=>handleDeleted(item)}>삭제</button>
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
                              <button className={styles.button} onClick={()=>handleEditItem(item)}>수정</button>
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
              if(data.length > (currentPage * 5)){
                setCurrentPage(currentPage + 1);
              } else {
                alert("다음 페이지가 없습니다.")
              }}}>
                <i className="far fa-angle-right"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}