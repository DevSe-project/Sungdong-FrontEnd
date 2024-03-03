import { useNavigate } from "react-router-dom";
import { useAdminSearchActions, useAdminSearchStore, useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from "../../../store/DataStore";
import { useFetch } from "../../../customFn/useFetch";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from './AdminSearch.module.css'
import React from "react";
import Pagination from '../../../customFn/Pagination';
import AdminDelNumModal from '../Sold/AdminDelNumModal';
import AdminCancelModal from '../Sold/AdminCancelModal';
import AdminSoldModal from '../Sold/AdminSoldModal';

export function AdminSearch() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); //페이지당 렌더링 될 개수
  const [totalPages, setTotalPages] = useState(1);
  const [postCnt, setPostCnt] = useState(10);
  const [selectedData, setSelectedData] = useState(null); //선택한 주문의 상품 데이터가 담기는 변수
  //검색 결과 데이터 fetch
  const { fetchAddPostServer, fetchNonPageServer } = useFetch();

  //ZUSTAND STATE
  const { isModal, modalName } = useModalState(); //모달창 불러오는 State (isModal - 모달창 불러오기, modalName - 모달이름 구성)
  const { selectedModalOpen } = useModalActions(); //모달이름으로 모달을 선택하여 오픈하는 변수
  const selectList = useOrderSelectList(); // 선택한 데이터를 담는 변수
  const { toggleSelectList, toggleAllSelect, resetSelectList } = useOrderSelectListActions(); //체크박스 관련 변수


  const fetchSearchData = async () => {
    const getSearch = JSON.parse(sessionStorage.getItem('adminSearchTerm'));
    const data = await fetchAddPostServer(getSearch.state.searchTerm, 'post', '/search/admin/list', 1, postCnt);
    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);
    setPostCnt(data.data.postsPerPage);
    return data.data.data;
  }

  const { isLoading, isError, error, data: ordered } = useQuery({ queryKey: ['adminSearch', currentPage, itemsPerPage], queryFn: () => fetchSearchData() });

  //-------------------------페이지 설정------------------------------


  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 검색창 상태 리셋
      useAdminSearchStore.persist.clearStorage();
      window.location.reload();
      resetSelectList();
    };
  }, []);

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    const getSearch = JSON.parse(sessionStorage.getItem('adminSearchTerm'));
    return await fetchAddPostServer(getSearch.state.searchTerm, 'post', '/search/admin/list', pageNumber, postCnt);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        setPostCnt(data.data.postsPerPage);
        queryClient.setQueryData(['adminSearch', currentPage, itemsPerPage], () => {
          return data.data.data
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
      if (ordered) {
        setCurrentPage(ordered.currentPage);
        setTotalPages(ordered.totalPages);
        setPostCnt(ordered.postsPerPage);
      }
    };

    fetchData();
  }, [ordered])

  //------------------------------------------------------

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
  /**
   * @발송
   * 발송처리 핸들러
   * - 주문이 한 개라도 체크되어 있어야 함
   * - 조건 달성 시 "발송" 이름의 모달 오픈
   */
  const handleDelNumInput = () => {
    if (selectList.length !== 0) {
      selectedModalOpen("발송");
    } else {
      alert("주문이 한 개라도 체크가 되어 있어야 발송처리가 가능합니다.");
    }
  }

  /**
   * @취소
   * 취소처리 핸들러
   * - 주문이 한 개라도 체크되어 있어야 함
   * - 조건 달성 시 "취소" 이름의 모달 오픈
   */
  const handleCancel = () => {
    if (selectList.length !== 0) {
      selectedModalOpen("취소");
    } else {
      alert("주문이 한 개라도 체크가 되어 있어야 취소처리가 가능합니다.");
    }
  }

  function isAnyCheckboxDisabled() {
    // ordered 배열을 순회하면서 disabled 상태를 판별
    for (const item of ordered) {
      if (item.orderState === 5) {
        return true; // disabled 상태인 체크박스가 하나라도 있으면 true 반환
      }
    }
    return false; // disabled 상태인 체크박스가 없으면 false 반환
  }

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.main}>
      <main className={styles.container}>
        <div className={styles.bodyHeader}>
          <h1>검색 결과</h1>
        </div>
        {/* 목록 */}
        <div className={styles.tableLocation}>
          {/* 목록 상위 타이틀 */}
          <div className={styles.listContainer}>
            <h4 style={{ fontWeight: '650' }}>목록</h4>
            <div style={{ display: 'flex', gap: '1em' }}>
              <select defaultValue={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
                <option value={5}>5개씩 보기</option>
                <option value={10}>10개씩 보기</option>
                <option value={50}>50개씩 보기</option>
                <option value={100}>100개씩 보기</option>
              </select>
            </div>
          </div>
          {/* 필터 */}
          <h5 style={{ margin: '1em' }}>
            <span style={{ color: '#CC0000', fontWeight: '650', margin: '0.5em' }}>{ordered.length ? ordered.length : 0}건<span style={{ color: 'black' }}>이 검색 되었습니다.</span></span>
          </h5>
          {/* 발주, 발송, 취소 처리 박스 */}
          <div className={styles.manageBox}>
            <button onClick={() => handleDelNumInput()} className={styles.button}>발송처리</button>
            <button onClick={() => handleCancel()} className={styles.button}>취소처리</button>
          </div>
          {/* 리스트 출력 */}
          <table className={styles.table}>
            <thead
              style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              <tr>
                <th><input type='checkbox'
                  checked={selectList.length === ordered.length && ordered.length > 0}
                  onChange={handleToggleAllSelect}
                  disabled={isAnyCheckboxDisabled()} 
                  />
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
                      {item.orderState === 5
                        ?
                        <td><input type='checkbox' name='list' disabled /></td>
                        :
                        <td>
                          <input type="checkbox" name="list" checked={selectList.some((filter) => filter.order_id === item.order_id)} onChange={() => toggleSelectList(item.order_id, item)} />
                        </td>
                      }
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
                        {item.orderState === 0 ? '결제 대기'
                          : item.orderState === 1 ? '결제 완료'
                            : item.orderState === 2 ? '배송 준비중'
                              : item.orderState === 3 ? '배송 중'
                                : item.orderState === 4 ? '배송 완료'
                                  : item.orderState === 5 ? '주문 취소'
                                    : item.orderState === 6 ? '주문 취소요청'
                                      : '누락된 상품(고객센터 문의)'}
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
                                <th>
                                  브랜드
                                </th>
                                <th>
                                  선택 옵션
                                </th>
                                <th>
                                  재고
                                </th>
                                <th>
                                  공급가
                                </th>
                                <th>
                                  주문량
                                </th>
                                <th style={{ fontWeight: '650' }}>
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
                : <tr><td colSpan="8">불러들일 데이터가 없습니다.</td></tr>
              }
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>
      {modalName === "발송"
        ?
        isModal && <AdminDelNumModal />
        : modalName === "취소" &&
        isModal && <AdminCancelModal />
      }
    </div>
  )
}