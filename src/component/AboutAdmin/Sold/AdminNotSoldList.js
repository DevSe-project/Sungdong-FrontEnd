import styles from './AdminNotSoldList.module.css';
import React, { useState } from 'react';
import AdminSoldModal from './AdminSoldModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from '../../../store/DataStore';
import { useFetch } from '../../../customFn/useFetch';
import Pagination from '../../../customFn/Pagination';
import AdminCancelModal from './AdminCancelModal';

export function AdminNotSoldList(props) {

  //ZUSTAND STATE
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();
  const queryClient = useQueryClient();

  const { fetchAddPostServer, fetchNonPageServer } = useFetch();
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedData, setSelectedData] = useState(null);

  const selectList = useOrderSelectList();
  const { toggleSelectList, toggleAllSelect } = useOrderSelectListActions();

  //전체 선택 핸들러
  const handleToggleAllSelect = () => {
    const allSelected = selectList.length === ordered.length; // 모든 항목이 선택되었는지 확인
    toggleAllSelect(!allSelected, ordered); // 전체 선택 토글
  };

  // -=-=-=-=-=-=-= 페이지를 변경할 때 호출되는 함수 =-=-=-=-=-=-=-
  const fetchPageChange = async (pageNumber) => {
    const limit = {
      orderState: 1
    }
    return await fetchAddPostServer(limit, 'post', '/order/all', pageNumber, itemsPerPage);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['yetOrder'], () => {
          return data.data.data[0]
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }
  //--------------------------------------------------------------
  //데이터 불러오기
  const fetchData = async () => {
    const limit = {
      orderState: 1
    }
    const data = await fetchAddPostServer(limit, `post`, `/order/all`, 1, itemsPerPage ? itemsPerPage : 10);
    console.log(data)
    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    return data.data.data[0];
  }

  // Fetch
  const { isLoading, isError, error, data: ordered } = useQuery({
    queryKey: [`yetOrder`, currentPage ? currentPage : 1, itemsPerPage ? itemsPerPage : 10],
    queryFn: () => fetchData()
  }) // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함

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
      <main className={styles.container}>
        {/* 리스트 출력 */}
        <div className={styles.bodyHeader}>
          <h1>미결제 주문 관리</h1>
        </div>
        <div className={styles.tableLocation}>
          <div className={styles.manageBox}>
            <button onClick={() => handleCancel()} className={styles.button}>취소처리</button>
          </div>
          <table className={styles.table}>
            <thead
              style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              <tr>
                <th><input type='checkbox'
                  checked={selectList?.length === ordered?.length && ordered?.length > 0}
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
              {ordered && ordered?.length > 0
                ? ordered.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className={styles.list}>
                      <td><input type="checkbox" name="list" checked={selectList.some((filter) => filter.order_id === item.order_id)} onChange={() => toggleSelectList(item.order_id, item)} /></td>
                      <td>
                        {item.order_id}
                      </td>
                      <td>
                        {item.deliveryType &&
                          item.deliveryType === '화물'

                          ? item.deliverySelect === 'kr.kdexp'
                            ? `${item.deliveryType && item.deliveryType} (배송 업체 : 경동화물)`
                            : `${item.deliveryType && item.deliveryType} (배송 업체 : 대신화물)`

                          : item.deliveryType &&
                            item.deliveryType === '성동택배'

                            ? `${item.deliveryType && item.deliveryType} 
                              (배송 예정일 : ${item.delivery_date && new Date(item.delivery_date).toLocaleDateString()})`
                            : item.deliveryType && item.deliveryType === '일반택배'
                              ? `${item.deliveryType} (배송 업체 : 대한통운)`
                              : '직접 픽업'}
                      </td>
                      <td>
                        {item.orderState === 0 && "결제 미 완료"}
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
                                    {itemData.selectedOption ? itemData.selectedOption : '없음'}
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
                    {/* 주문서 정보 모달 */}
                    {modalName === item.order_id && <AdminSoldModal item={item} />}
                  </React.Fragment>
                ))
                : <tr><td colSpan="10">불러들일 데이터가 없습니다.</td></tr>
              }
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>
      {
        modalName === "취소" &&
        isModal && <AdminCancelModal />
      }
    </div >
  )
}