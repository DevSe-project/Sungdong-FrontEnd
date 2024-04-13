import styles from './AdminSoldList.module.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { AdminSoldFilter } from './AdminSoldFilter';
import { useModalActions, useModalState, useOrderFilter, useOrderSelectList, useOrderSelectListActions } from '../../../store/DataStore';
import AdminDelNumModal from './AdminDelNumModal';
import AdminCancelModal from './AdminCancelModal';
import AdminSoldModal from './AdminSoldModal';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../../customFn/useFetch';
import Pagination from '../../../customFn/Pagination';
import axios from '../../../axios';

export function AdminSoldList() {

  // -------------------------------------- STATE 공간 ---------------------------------------------
  const { fetchGetAddPostServer, fetchAddPostServer, fetchNonPageServer,fetchServer } = useFetch(); //Fetch Custom Hook
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(10); //페이지당 렌더링 될 개수
  const [totalPages, setTotalPages] = useState(1); //전체 페이지 개수
  const [selectedData, setSelectedData] = useState(null); //선택한 주문의 상품 데이터가 담기는 변수
  const queryClient = useQueryClient();

  //ZUSTAND STATE
  const { isModal, modalName } = useModalState(); //모달창 불러오는 State (isModal - 모달창 불러오기, modalName - 모달이름 구성)
  const { selectedModalOpen } = useModalActions(); //모달이름으로 모달을 선택하여 오픈하는 변수
  const orderFilter = useOrderFilter(); // 주문 필터링 구성
  const selectList = useOrderSelectList(); // 선택한 데이터를 담는 변수
  const { toggleSelectList, toggleAllSelect, resetSelectList } = useOrderSelectListActions(); //체크박스 관련 변수
//--------------------------------------------------------------------------------------------------

  /**
   * 컴포넌트 이동시 체크박스 상태 초기화
   */
  useEffect(() => {
    return () => {
      resetSelectList();
      // 컴포넌트가 언마운트될 때 Product 상태 리셋
    };
  }, []);

  /**
   * @불러오기
   * GET FETCH
   * - 모든 주문 데이터를 불러오는 동기형 FETCH
   *    * useQuery (react-query Hook) 사용
   *    * queryKey : ['order']
   *    * queryFn : fetchData();
   *    * return : ordered 변수로 리턴됨
   * @returns {*} -data.data[0]에 담긴 객체정보-
   * - 주소 관련
   *    * zonecode : 주소 :: 우편번호
   *    * addressDetail: 주소 :: 상세주소
   *    * roadAddress : 주소 :: 도로명 주소
   *    * bname : 주소 :: 동 이름
   *    * jibunAddress : 주소 :: 지번
   *    * buildingName : 주소 :: 건물 이름
   * - 배송 관련
   *    * deliveryType : 배송 구분
   *    * delivery_addDate : 배송 시작 일자
   *    * delivery_cDate : 배송 처리 일자
   *    * delivery_date : 희망 배송 일자
   *    * delivery_id : 배송 번호
   *    * delivery_message : 배송 메세지
   *    * delivery_num : 송장 번호
   *    * delivery_selectedCor : 선택한 희망 배송사
   *    * delivery_state : 배송 상태
   * 
   * - 주문 관련
   *    * orderState : 주문 상태
   *    * order_date : 주문 날짜
   *    * order_delName : 배송지 성함
   *    * order_delTel : 배송지 전화번호
   *    * order_email : 주문자 이메일
   *    * order_faxNum : 주문자 팩스번호
   *    * order_id : 주문 번호
   *    * order_moneyReceipt : 주문 영수증 구분
   *    * order_tel : 주문자 전화번호
   *    * order_name : 주문자 성함
   *    * order_payAmount : 주문 총 가격
   *    * order_payRoute : 주문 지불방법
   *    * order_sum : 주문 합계
   * - cancelReason : 취소 사유
   * - isCancel : 취소여부 (TINYINT 0 or 1)
   * - printFax : 팩스 출력여부 *(boolean Type)
   * - product_length : 주문 상품의 개수
   * - product_title : 주문 상품의 대표 상품명
   * - smtMessage : 성동 메세지
   * - userType_id : 유저 구분 번호
   * - users_id : 유저 고유 번호
   * - corName : 주문 기업명
   */
  const fetchData = async () => {
    const data = await fetchGetAddPostServer(`/order/all`, currentPage, itemsPerPage);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data[0];
  }

  const { isLoading, isError, data: ordered } = useQuery({
    queryKey: [`order`, currentPage, itemsPerPage],
    queryFn: () => fetchData()
  }) // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
  
  //---------------------------------------------------------------------------------

  /**
   * @페이지
   * POST FETCH
   * - 페이지 변경을 위한 pageMutation 사용 (react-query Hook)
   * @param {*} pageNumber 변경 될 페이지 번호 (숫자형식)
   * @returns data(@불러오기 데이터 객체 정보 참조)
   */
  const fetchPageChange = async (pageNumber) => {
    return await fetchAddPostServer({}, 'post', '/order/all', pageNumber, itemsPerPage);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  /**
   * @페이지
   * Mutation 선언부
   * - setQueryData : queryKey['order']을 리턴된 data의 값으로 재 지정
   * @param {*} pageNumber 변경 될 페이지 번호 (숫자형식)
   */
  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['order'], () => {
          return data.data.data[0]
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //-------------------------------------------------------------------------------------


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

  /*---------- 필터 검색 ----------*/
  
  /**
   * @필터 POST FETCH 
   * - 필터 검색 Mutation (react-query :: Mutation Hook) 사용
   * @param {*} filter 객체 정보
   * - date: {start: '', end: ''} - 시작 날짜와 끝 날짜 필터
   * - dateType: "" - 색인할 날짜 타입 필터
   * - deliveryType: "" - 배송 구분 필터
   * - selectFilter: "" - 상세 필터
   * - filterValue: "" - 상세 필터 조건
   */
  const fetchFilteredOrders = async (filter) => {
    return await fetchServer(filter, `post`, `/order/filter`, 1);
  };

  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredOrders })

  /**
   * @검색 Mutation 선언부

   * @returns 필터된 상품의 데이터 객체 (@불러오기 returns 데이터 정보 참조)
   */
  const handleSearch = () => {

    // 검색 버튼 클릭 시에만 서버에 요청
    filterMutation(orderFilter, {
      onSuccess: (data) => {
        alert(data.message)
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['order', currentPage, itemsPerPage], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })  };

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

  /**
   * 엑셀 출력 핸들러
   */
  async function handlePrintExcel(){
    try {
      // 서버로부터 엑셀 데이터 요청
      // responseType을 'blob'으로 설정
      const itemData = await fetchNonPageServer({}, `post`, `/order/all/items`);
      if(itemData){
        console.log(itemData);
        const response = await axios.post('/order/excel', itemData.data.data[0], { responseType: 'blob' });
        // Blob 데이터로 URL 생성
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // a 태그를 생성하여 다운로드 링크 설정
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'order.xlsx'); // 다운로드될 파일명 설정
        document.body.appendChild(link);
        link.click(); // 프로그래밍적으로 클릭 이벤트 발생
        // 생성된 URL 해제
        window.URL.revokeObjectURL(url);
        // 생성된 a 태그 제거
        document.body.removeChild(link);
      }
  } catch (error) {
      console.error('Download failed', error);
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
        <div className={styles.bodyHeader}>
          <h1>미결제 / 결제완료 주문 및 발송 처리</h1>
        </div>
        {/* 필터 */}
        <AdminSoldFilter handleSearch={handleSearch} />
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
          {/* 발주, 발송, 취소 처리 박스 */}
          <div className={styles.manageBox}>
            <button onClick={() => handlePrintExcel()} className="original_button">발주서 엑셀 출력</button>
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
                  onChange={handleToggleAllSelect} />
                </th>
                <th>주문번호</th>
                <th>배송사</th>
                <th>주문상태</th>
                <th>주문상품</th>
                <th>주문일자</th>
                <th>기업명</th>
                <th>주문자명</th>
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
                        {item.orderState === 1 ? "신규주문" :
                          item.orderState === 2 && "발송완료"}
                      </td>
                      <td onClick={() => {
                        if (selectedData?.some((selectItem) => selectItem.order_id === item.order_id)) {
                          setSelectedData(null);
                        } else
                          handleOpenItem(item.order_id);
                      }}>
                        <h5 className={styles.detailView}>
                          {item.product_title} {(item.product_length - 1) > 0 && `외 ${item.product_length - 1}건`}
                        </h5>
                      </td>
                      <td>
                        {new Date(item.order_date).toLocaleString()}
                      </td>
                      <td>
                        {item.corName}
                      </td>
                      <td>
                        {item.order_name}
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
                        <td colSpan="10">
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
                                  <td style={{ fontWeight: '750' }}>
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
