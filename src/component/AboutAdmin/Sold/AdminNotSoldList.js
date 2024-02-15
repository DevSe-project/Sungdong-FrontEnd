import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import styles from './AdminNotSoldList.module.css';
import React, { useEffect, useState } from 'react';
import AdminSoldModal from './AdminSoldModal';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../store/DataStore';
export function AdminNotSoldList(props) {
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  //ZUSTAND STATE
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();

  //데이터 불러오기
  // Fetch
  const { isLoading: deliveryLoading, isError: deliveryError, data: delivery } = useQuery({ queryKey: ['delivery'] });
  const { isLoading: orderedLoading, isError: orderedError, data: ordered } = useQuery({ queryKey: ['ordered'] });
  const { isLoading: productLoading, isError: productError, data: product } = useQuery({ queryKey: ['data'] });


  // 업데이트 함수 호출
  useEffect(() => {
    updateMatchedData();
  }, [ordered, delivery, product]);

  // 게시물 데이터와 페이지 번호 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 현재 페이지에 해당하는 게시물 목록 가져오기 - 서버측 처리 변경요망
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage; // 한 페이지에 정렬 개수만큼 표시
    return filteredItems.length > 0 && filteredItems.slice(startIndex, startIndex + itemsPerPage)
  };


  // 상태 업데이트를 위한 함수
  const updateMatchedData = () => {
    // 해당 데이터가 모두 불러와졌을 때만 함수 실행, 하나라도 데이터가 로딩되지 않았다면 함수 종료
    if (!ordered || !delivery || !product) {
      return;
    }
    // ordered와 delivery, product 매칭
    const finalMatchedData = ordered.map(orderItem => {
      const deliveryItem = delivery.find(
        deliveryItem => deliveryItem.orderId === orderItem.id
      );
      const productItem = product.find(
        productItem => productItem.id === orderItem.ProductId
      );

      return { ...orderItem, ...deliveryItem, ...productItem };
    });



    setFilteredItems(finalMatchedData.filter((item) => item.orderState === 0));
  };

  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (deliveryLoading || orderedLoading || productLoading) {
    return <p>Loading...</p>;
  }
  if (deliveryError || orderedError || productError) {
    return <p>Error fetching data</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {/* 리스트 출력 */}
        <div className={styles.bodyHeader}>
          <h1>미결제 주문 관리</h1>
        </div>
        <div className={styles.tableLocation}>
          <table className={styles.table}>
            <thead
              style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              <tr>
                <th><input type='checkbox' disabled /></th>
                <th>이미지</th>
                <th style={{ width: '10%' }}>상품코드</th>
                <th style={{ width: '10%' }}>주문번호</th>
                <th style={{ width: '10%' }}>상품명</th>
                <th style={{ width: '10%' }}>옵션</th>
                <th style={{ width: '10%' }}>주문량</th>
                <th style={{ width: '10%' }}>공급가</th>
                <th style={{ width: '10%', fontWeight: '650' }}>주문가</th>
                <th style={{ width: '13%', fontWeight: '650' }}>주문자 정보</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0
                ? getCurrentPagePosts().map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className={styles.list}>
                      <td><input type="checkbox" name="list" /></td>
                      <td><img src={item.image.mini} alt='이미지'></img></td>
                      <td>{item.ProductId}</td>
                      <td>
                        {item.orderId}
                      </td>
                      <td>
                        <h5 style={{ fontSize: '1.1em', fontWeight: '550' }}>{item.title}</h5>
                      </td>
                      <td>
                        {item.optionSelected
                          ? item.optionSelected
                          : '옵션없음'
                        }
                      </td>
                      <td>{item.order_cnt}</td>
                      <td>\{item.order_productPrice.toLocaleString()}</td>
                      <td style={{ fontWeight: '750' }}>
                        {item.order_payAmount}
                      </td>
                      <td
                        className={styles.detailView}
                        onClick={() => selectedModalOpen(item.id)}
                      >
                        보기
                      </td>
                    </tr>
                    {/* 모달 State가 true일때 생성됨 */}
                    {modalName === item.id && <AdminSoldModal item={item} />}
                  </React.Fragment>
                ))
                : <tr><td colSpan="10">불러들일 데이터가 없습니다.</td></tr>
              }
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            {/* 이전 페이지 */}
            <button
              className={styles.button}
              onClick={() => {
                if (currentPage !== 1) {
                  setCurrentPage(currentPage - 1)
                } else {
                  alert("해당 페이지가 가장 첫 페이지 입니다.")
                }
              }}>
              <i className="far fa-angle-left" />
            </button>
            <div className={styles.button}>
              {currentPage}
            </div>
            {/* 다음 페이지 */}
            <button
              className={styles.button}
              onClick={() => {
                if (filteredItems.length > (currentPage * itemsPerPage)) {
                  setCurrentPage(currentPage + 1)
                } else {
                  alert("다음 페이지가 없습니다.")
                }
              }}>
              <i className="far fa-angle-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}