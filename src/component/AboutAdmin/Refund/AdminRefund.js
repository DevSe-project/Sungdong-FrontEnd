import styles from './AdminRefund.module.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { AdminRefundFilter } from '../Refund/AdminRefundFilter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState, useOrderSelectList, useOrderSelectListActions } from '../../../store/DataStore';
import AdminRefundModal from './AdminRefundModal';
import AdminRefundDialog from './AdminRefundDialog';
import AdminRefundStateModal from './AdminRefundStateModal';
import { useFetch } from '../../../customFn/useFetch';

export function AdminRefund() {


  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);
  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  //ZUSTAND STATE
  const { modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();
  const {fetchGetServer, fetchServer, fetchNonPageServer} = useFetch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedData, setSelectedData] = useState(null);




  //데이터 불러오기
  // Fetch
  const { isLoading: raeLoading, isError: raeError, data: rae } = useQuery({ queryKey: ['raeAdmin'], queryFn: ()=> fetchData()});

    //fetch
    const fetchData = async() => {
      const data = await fetchGetServer(`/rae/admin/list`, 1);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      return data.data;
    }
  
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [itemsPerPage, setItemsPerPage] = useState(5);

  //페이지 변경 핸들링
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

    //----------------------체크박스------------------------
  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = rae?.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item === product)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item !== product)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if (selectedItems.length + 1 === rae?.length) {
        setSelectAll(true);
      }
    }
  };

    // ---------------- 아이템 열람 Mutation -----------------

    const mutationfetch = async (orderId) => {
      const data = await fetchNonPageServer(orderId, `post`, `/rae/admin/find/product`)
      return data;
    }
  
    const { mutate: matchedItemMutation } = useMutation({ mutationFn: mutationfetch })

    function handleOpenItem(raeId) {
      const raeItem = {
        rae_id: raeId
      }
      matchedItemMutation(raeItem, {
        onSuccess: (success) => {
          setSelectedData(success.data);
        },
        onError: (error) => {
          return console.error(error.message);
        }
      })
    }

  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (raeLoading) {
    return <p>Loading...</p>;
  }
  if (raeError) {
    return <p>Error fetching data</p>;
  }
  return (
    <div className={styles.main}>
      <main className={styles.container}>
        <div className={styles.bodyHeader}>
          <h1>반품/교환/취소 관리</h1>
        </div>
        {/* 필터 */}
        <AdminRefundFilter />
        {/* 목록 */}
        <div className={styles.tableLocation}>
          {/* 목록 상위 타이틀 */}
          <div className={styles.listContainer}>
            <h4 style={{ fontWeight: '650' }}>목록</h4>
            <div style={{ display: 'flex', gap: '1em' }}>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={50}>50개씩 보기</option>
                <option value={100}>100개씩 보기</option>
              </select>
            </div>
          </div>
          {/* 발주, 발송, 취소 처리 박스 */}
          <div className={styles.manageBox}>
            <button className={styles.button} onClick={() => selectedItems.length > 0 && selectedModalOpen("완료")}>반품/교환/취소 완료처리</button>
            <button className={styles.button} onClick={() => selectedItems.length > 0 && selectedModalOpen("철회")}>반품/교환/취소 거부(철회)처리</button>
            <button className={styles.button} onClick={() => selectedItems.length > 0 && selectedModalOpen("상태 변경")}>처리 상태 변경</button>
          </div>
          {/* 리스트 출력 */}
          <table className={styles.table}>
            <thead
              style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              {/* 헤드 */}
              <tr>
                <th>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={() => handleSelectAllChange()} />
                </th>
                <th>전표번호</th>
                <th colSpan={2}>요청날짜</th>
                <th>처리상태</th>
                <th>철회사유</th>
                <th>처리날짜</th>
                <th colSpan={3}>포함된 상품</th>
                <th colSpan={2}>기업명</th>
                <th>담당자</th>
                <th colSpan={2}>반환가액</th>
                <th colSpan={2}>반환상품 상세보기</th>
              </tr>
            </thead>
            <tbody>
              {rae.length > 0
                ? rae.map((item,index) => (
                  <React.Fragment key={index}>
                    <tr className={styles.list} onClick={()=>{
                      if (selectedData?.some((selectItem) => selectItem.rae_id === item.rae_id)) {
                          setSelectedData(null);
                        } else
                          handleOpenItem(item.rae_id);
                        }
                      }>
                      <td>
                        <input
                        checked={selectedItems.some(select => select === item)}
                        onChange={() => checkedBox(item)}
                        type='checkbox'
                        />
                      </td>    
                      <td>
                        {item.rae_id}
                      </td>
                      <td colSpan={2}>{new Date(item.rae_requestDate).toLocaleDateString()}</td>
                      <td>
                        {item.raeState === 1 ? "요청" :
                          item.raeState === 2 ? "수거중" :
                            item.raeState === 3 ? "수거완료" :
                              item.raeState === 4 ? "완료" :
                                item.raeState === 5 && "철회"}
                      </td>
                      <td>{item.rae_cancelReason ? item.rae_cancelReason : '없음'}</td>
                      <td>
                        {item.rae_checkDate ? item.rae_checkDate : '미 처리'}
                      </td>
                      <td style={{ fontSize: '1.1em', fontWeight: '550' }} colSpan={3}>
                        {item.product_title} {(item.product_length - 1) > 0 && `외 ${item.product_length - 1}건`}
                      </td>
                      <td colSpan={2}>
                        {item.corName}
                      </td>
                      <td>
                        <h5>
                          {item.rae_manager ? item.rae_manager : '미 배정'}
                        </h5>
                      </td>
                      <td style={{ fontWeight: '750' }} colSpan={2}>
                        \{parseInt(item.rae_payAmount).toLocaleString()}
                      </td>
                      <td className={styles.detailView} colSpan={2}>
                        더보기
                      </td>
                    </tr>
                      {/* 아이템 모달 */}
                      {selectedData?.some((selectItem) => selectItem.rae_id === item.rae_id) && (
                      <tr>
                        <td colSpan="17">
                          <table className={styles.colTable}>
                            <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)' }}>
                              <tr>
                                <th>
                                  구분
                                </th>
                                <th>
                                  포장상태
                                </th>
                                <th>
                                  상품상태
                                </th>
                                <th>
                                  바코드상태
                                </th>
                                <th>
                                  품명
                                </th>
                                <th>
                                  상품코드
                                </th>
                                <th>
                                  옵션
                                </th>
                                <th>
                                  반환수단
                                </th>
                                <th>
                                  반환수량
                                </th>
                                <th>
                                  반환가
                                </th>
                                <th>
                                  반환사유
                                </th>
                                <th>
                                  신청인
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedData?.map((itemData, index) =>
                                <tr key={index}>
                                  <td>
                                    {itemData.rae_type === 0 ? '반품' : '교환'}
                                  </td>
                                  <td>
                                    {itemData.wrapStatus}
                                  </td>
                                  <td>
                                    {itemData.productStatus}
                                  </td>
                                  <td>
                                    {itemData.barcodeStatus}
                                  </td>
                                  <td style={{ fontWeight: '550' }}>
                                    {itemData.product_title}
                                  </td>
                                  <td>
                                    {itemData.product_id}
                                  </td>
                                  <td>
                                    {itemData.selectedOption ? itemData.selectedOption : '없음'}
                                  </td>
                                  <td style={{ fontWeight: '550' }}>
                                    {itemData.rae_returnDel}
                                  </td>
                                  <td>
                                    {itemData.rae_product_cnt}
                                  </td>
                                  <td style={{ fontWeight: '750' }}>
                                    {parseInt(itemData.rae_product_amount)
                                      .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                                  </td>
                                  <td>
                                    {itemData.rae_reason ? itemData.rae_reason : '없음'}
                                  </td>
                                  <td>
                                    {itemData.rae_writter ? itemData.rae_writter : '없음'}
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
                : <tr><td colSpan="12">불러들일 데이터가 없습니다.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </main>
      {(selectedItems.length > 0 && (modalName === "완료" || modalName === "철회")) && <AdminRefundDialog selectList={selectedItems} />}
      {(selectedItems.length > 0 && modalName === "상태 변경") && <AdminRefundStateModal selectList={selectedItems} />}
    </div>
  )
}
