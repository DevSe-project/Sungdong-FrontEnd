import styles from './AdminSoldList.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { AdminSoldFilter } from './AdminSoldFilter';
import AdminSoldModal from './AdminSoldModal';
import { useModalActions, useModalState, useOrderFilter, useOrderSelectList, useOrderSelectListActions } from '../../../Store/DataStore';
import axios from 'axios';
import AdminDelNumModal from './AdminDelNumModal';
import AdminCancelModal from './AdminCancelModal';
export function AdminSoldList(props){

  const { isModal, modalName } = useModalState();
  const {selectedModalOpen} = useModalActions();
  const selectList = useOrderSelectList();
  const {toggleSelectList, resetSelectList} = useOrderSelectListActions();
  
  const [sortOrder, setSortOrder] = useState('asc'); // 초기값으로 오름차순 설정
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const orderFilter = useOrderFilter();

  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  const navigate = useNavigate();

  //결제완료인 목록만 필터링
  const filteredOrderData = props.orderData && props.orderData.filter((item) => item.orderState >= 1);

  // 정렬만 수행
  useEffect(() => {
    // 클라이언트 측에서 데이터 정렬을 수행
    if(props.orderData) {
      const sortedData = filteredOrderData.sort((a, b) => {
        // 예시: 숫자 데이터를 기준으로 정렬
        if (sortOrder === 'asc') {
          return a.numberField - b.numberField;
        } else {
          return b.numberField - a.numberField;
        }
      });

      // 정렬된 데이터를 업데이트
      setFilteredItems(sortedData);
    }
  }, [sortOrder]);
    
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage; // 한 페이지에 정렬 개수만큼 표시
    return filteredItems.length > 0 
    ? filteredItems.slice(startIndex, startIndex + itemsPerPage) 
    : props.orderData && filteredOrderData.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const fetchFilteredOrder = async (filter) => {
    try {
      const response = await axios.get('/order', { params: filter });
      return response.data;
    } catch (error) {
      throw new Error('상품 데이터를 불러오던 중 오류가 발생했습니다.');
    }
  };

    // const { data:filteredItems, isLoading, isError } = useQuery(['filteredOrder', orderFilter], () => fetchFilteredProducts(orderFilter));


  const handleSearch = () => {
    // 검색 버튼 클릭 시에만 서버에 요청
    fetchFilteredOrder(orderFilter);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

const handleDelNumInput = () => {
  if(selectList.length !== 0){
    selectedModalOpen("발송");
  } else {
    alert("주문이 한 개라도 체크가 되어 있어야 발송처리가 가능합니다.");
  }
}

const handleCancel = () => {
  if(selectList.length !== 0){
    selectedModalOpen("취소");
  } else {
    alert("주문이 한 개라도 체크가 되어 있어야 취소처리가 가능합니다.");
  }
}

  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <main className={styles.container}>
          <div className={styles.bodyHeader}>
            <h1>결제완료 주문 및 발송 처리</h1>
          </div>
          {/* 필터 */}
          <AdminSoldFilter handelSearch={handleSearch}/>
          {/* 목록 */}
          <div className={styles.tableLocation}>
            {/* 목록 상위 타이틀 */}
            <div className={styles.listContainer}>
              <h4 style={{fontWeight: '650'}}>목록</h4>
              <div style={{ display: 'flex', gap: '1em' }}>
                <select value={sortOrder} onChange={handleSortOrderChange}>
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value={50}>50개씩 보기</option>
                  <option value={100}>100개씩 보기</option>
                </select>
              </div>
            </div>
            {/* 발주, 발송, 취소 처리 박스 */}
            <div className={styles.manageBox}>
              <button onClick={()=> handleDelNumInput()} className={styles.button}>발송처리</button>
              <button onClick={()=> handleCancel()} className={styles.button}>취소처리</button>
            </div>
            {/* 리스트 출력 */}
            <table className={styles.table}>
              <thead 
              style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
              >
                <tr>
                  <th><input type='checkbox' disabled/></th>
                  <th>이미지</th>
                  <th style={{width:'10%'}}>상품코드</th>
                  <th style={{width:'10%'}}>주문번호</th>
                  <th style={{width:'10%'}}>배송사</th>
                  <th style={{width:'10%'}}>발송여부</th>
                  <th style={{width:'10%'}}>상품명</th>
                  <th style={{width:'10%'}}>옵션</th>
                  <th style={{width:'10%'}}>주문량</th>
                  <th style={{width:'10%'}}>공급가</th>
                  <th style={{width:'10%', fontWeight: '650'}}>주문가</th>
                  <th style={{width:'13%', fontWeight: '650'}}>주문자 정보</th>
                </tr>
              </thead>
              <tbody>
                {props.orderData 
                ? filteredOrderData.length > 0
                ? getCurrentPagePosts().map((item, index)=> (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><input type="checkbox" name="list" checked={selectList.some((filter) => filter.orderId === item.orderId) || ''} onChange={()=> toggleSelectList(item)}/></td>
                    <td><img src={item.image.mini} alt='이미지'></img></td>
                    <td>{item.productId}</td>
                    <td>
                      {item.orderId}
                    </td>
                    <td>
                      {item.delivery.deliverySelect}
                    </td>
                    <td>
                      {item.orderState === 1 ? "신규주문" :
                      item.orderState === 2 && "발송완료" }
                    </td>
                    <td>
                      <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.productName}</h5>
                    </td>
                    <td>{item.optionSelected}</td>
                    <td>{item.cnt}</td>
                    <td>\{item.price.toLocaleString()}</td>
                    <td style={{fontWeight: '750'}}>
                      {item.finprice
                      ? item.discount
                      ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                      : `\\${item.finprice.toLocaleString()}`
                      : `\\${item.price.toLocaleString()}`}
                    </td>
                    <td 
                      className={styles.detailView}
                      onClick={() => selectedModalOpen(item.orderId)}>
                      보기
                    </td>
                  </tr>
                  {/* 모달 State가 true일때 생성됨 */}
                  {modalName === item.orderId && <AdminSoldModal item={item} />}
                  </React.Fragment>
                  ))
                : <tr><td colSpan="10">불러들일 데이터가 없습니다.</td></tr>
                : <tr><td colSpan="10">로딩중</td></tr>
                }
              </tbody>
            </table>
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
                if(filteredItems.length > (currentPage * itemsPerPage)){
                  setCurrentPage(currentPage + 1)
                } else {
                  alert("다음 페이지가 없습니다.")
                }}}>
                  <i className="far fa-angle-right"/>
              </button>
            </div>
          </div>
        </main>
        {modalName === "발송" 
        ?
          isModal && <AdminDelNumModal/>
        : modalName === "취소" &&
          isModal && <AdminCancelModal/>
        }
      </div>
    </div>
  )
}
