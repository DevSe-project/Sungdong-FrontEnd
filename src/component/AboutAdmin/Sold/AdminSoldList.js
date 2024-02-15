import styles from './AdminSoldList.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import { AdminSoldFilter } from './AdminSoldFilter';
import AdminSoldModal from './AdminSoldModal';
import { useModalActions, useModalState, useOrderFilter, useOrderSelectList, useOrderSelectListActions } from '../../../store/DataStore';
import axios from '../../../axios';
import AdminDelNumModal from './AdminDelNumModal';
import AdminCancelModal from './AdminCancelModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFetch } from '../../../customFn/useFetch';
export function AdminSoldList() {

  const { fetchGetAddPostServer, fetchAddPostServer, fetchNonPageServer } = useFetch();
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedData, setSelectedData] = useState(null);

  //데이터 불러오기
  const fetchData = async () => {
    const data = await fetchGetAddPostServer(`/order/all`, 1, 50);
    return data.data[0];
  }

  // Fetch
  const { isLoading, isError, error, data: ordered } = useQuery({
    queryKey: [`order`, currentPage, itemsPerPage],
    queryFn: () => fetchData()
  }) // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함


  //ZUSTAND STATE
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();
  const selectList = useOrderSelectList();
  const { toggleSelectList, toggleAllSelect } = useOrderSelectListActions();

  const orderFilter = useOrderFilter();

  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);


  //전체 선택 핸들러
  const handleToggleAllSelect = () => {
    const allSelected = selectList.length === ordered.length; // 모든 항목이 선택되었는지 확인
    toggleAllSelect(!allSelected, ordered); // 전체 선택 토글
  };

  // ---------------- 아이템 열람 Mutation -----------------

  const mutationfetch = async (orderId) => {
    const data = await fetchNonPageServer(orderId, `post`, `/order/findSelectOrderProduct`)
    return data;
  }

  const { mutate: matchedItemMutation } = useMutation({ mutationFn: mutationfetch })

  function handleOpenItem(orderId) {
    const order = {
      order_id: orderId
    }
    matchedItemMutation(order, {
      onSuccess: (success) => {
        setSelectedData(success.data);
      },
      onError: (error) => {
        return console.error(error.message);
      }
    })
  }

  //검색 필터링
  const handleSearch = () => {
    // 검색 버튼 클릭 시에만 서버에 요청
    // fetchFilteredOrder(orderFilter);
  };

  //발송 처리 핸들러
  const handleDelNumInput = () => {
    if (selectList.length !== 0) {
      selectedModalOpen("발송");
    } else {
      alert("주문이 한 개라도 체크가 되어 있어야 발송처리가 가능합니다.");
    }
  }

  //취소 처리 핸들러
  const handleCancel = () => {
    if (selectList.length !== 0) {
      selectedModalOpen("취소");
    } else {
      alert("주문이 한 개라도 체크가 되어 있어야 취소처리가 가능합니다.");
    }
  }

  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error fetching data</p>;
  }

  return (
    <div className={styles.main}>
      <div className='LargeHeader'>결제완료 주문 및 발송 처리</div>
      {/* 필터 */}
      <AdminSoldFilter handelSearch={handleSearch} />
      {/* 목록 */}
      <div className={styles.tableLocation}>
        {/* 목록 상위 타이틀 */}
        <div className={styles.listContainer}>
          <h4 style={{ fontWeight: '650' }}>목록</h4>
          <div style={{ display: 'flex', gap: '1em' }}>
            <select value="">
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
            <select value="">
              <option value={50}>50개씩 보기</option>
              <option value={100}>100개씩 보기</option>
            </select>
          </div>
        </div>
        {/* 발주, 발송, 취소 처리 박스 */}
        <div className={styles.manageBox}>
          <button onClick={() => handleDelNumInput()} className={styles.button}>발송처리</button>
          <button onClick={() => handleCancel()} className={styles.button}>취소처리</button>
        </div>
        {/* 리스트 출력 */}
        <table>
          <thead
            style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            <tr>
              <th><input type='checkbox'
                checked={selectList.length === ordered.length && ordered.length > 0}
                onChange={handleToggleAllSelect} />
              </th>
              <th>주문번호</th>
              <th>배송사</th>
              <th>주문상태</th>
              <th>주문상품</th>
              <th>주문일자</th>
              <th>주문가</th>
              <th>주문자 정보</th>
            </tr>
          </thead>
          <tbody>
            {ordered.length > 0
              ? ordered.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><input type="checkbox" name="list" checked={selectList.some((filter) => filter.order_id === item.order_id)} onChange={() => toggleSelectList(item.order_id, item)} /></td>
                    <td>
                      {item.order_id}
                    </td>
                    <td>
                      {item.deliveryType}
                    </td>
                    <td>
                      {item.orderState === 1 ? "신규주문" :
                        item.orderState === 2 && "발송완료"}
                    </td>
                    <td onClick={() => {
                      if (selectedData?.some((selectItem) => selectItem.order_id === item.order_id)) {
                        setSelectedData(null);
                      } else
                        handleOpenItem(item.order_id);
                    }}>
                      <h5 style={{ fontSize: '1.1em', fontWeight: '550' }}>
                        {item.product_title} {(item.product_length - 1) > 0 && `외 ${item.product_length - 1}건`}
                      </h5>
                    </td>
                    <td>
                      {new Date(item.order_date).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '750' }}>
                      \{parseInt(item.order_payAmount).toLocaleString()}
                    </td>
                    <td
                      className={styles.detailView}
                      onClick={() => selectedModalOpen(item.order_id)}>
                      보기
                    </td>
                  </tr>
                  {/* 모달 State가 true일때 생성됨 */}
                  {modalName === item.order_id && <AdminSoldModal item={item} />}
                  {/* 아이템 모달 */}
                  {selectedData?.some((selectItem) => selectItem.order_id === item.order_id) && (
                    <tr>
                      <td colSpan="8">
                        <table className={styles.colTable}>
                          <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}>
                            <tr>
                              <th>
                                이미지
                              </th>
                              <th>
                                품명
                              </th>
                              <th>
                                상품코드
                              </th>
                              <th style={{ width: '25%' }}>
                                브랜드
                              </th>
                              <th style={{ width: '10%' }}>
                                선택 옵션
                              </th>
                              <th style={{ width: '20%' }}>
                                재고
                              </th>
                              <th style={{ width: '20%' }}>
                                공급가
                              </th>
                              <th style={{ width: '20%' }}>
                                주문량
                              </th>
                              <th style={{ width: '10%', fontWeight: '650' }}>
                                주문가
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedData?.map((itemData, index) =>
                              <tr key={index}>
                                <td>
                                  <img className={styles.thumnail} src={itemData.product_image_original} alt='이미지' />
                                </td>
                                <td>
                                  {itemData.product_title}
                                </td>
                                <td>
                                  {itemData.product_id}
                                </td>
                                <td>
                                  {itemData.product_brand}
                                </td>
                                <td>
                                  {itemData.selectedOption}
                                </td>
                                <td>
                                  {itemData.product_supply}
                                </td>
                                <td style={{ fontWeight: '750' }}>
                                  {itemData.product_discount
                                    ? `${parseInt(itemData.product_price - (itemData.product_price / 100) * itemData.product_discount)
                                      .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                                    : `${parseInt(itemData.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                                </td>
                                <td>
                                  {itemData.order_cnt}
                                </td>
                                <td style={{ fontWeight: '750' }}>
                                  {parseInt(itemData.order_productPrice)
                                    .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>

                  )}
                </React.Fragment>
              ))
              : <tr><td colSpan="10">불러들일 데이터가 없습니다.</td></tr>
            }
          </tbody>
        </table>
      </div>
      {modalName === "발송"
        ?
        isModal && <AdminDelNumModal />
        : modalName === "취소" &&
        isModal && <AdminCancelModal />
      }
    </div>
  )
}
