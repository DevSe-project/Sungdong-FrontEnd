import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../store/DataStore';
import styles from './Table.module.css';
import { TackBackFilter } from './TakeBackFilter';
import TakeBackModal from './TakeBackModal';
import { useState } from 'react';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination';
export function TackBackRequest() {
  const { isModal } = useModalState();
  const { setIsModal } = useModalActions();
  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);
  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  const { fetchGetServer, fetchServer } = useFetch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const queryClient = useQueryClient();

  const fetchOrderRefundData = async () => {
    const data = await fetchGetServer(`order/rae/list`, 1);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  }
  const { isLoading, isError, error, data: orderData } = useQuery({ queryKey: ['orderRefund'], queryFn: () => fetchOrderRefundData() });
  const [modalItem, setModalItem] = useState([]);

  function addRequest(item) {
    setIsModal(true);
    setModalItem(item);
  }

  //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/order/rae/list', pageNumber);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['orderRefund'], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //----------------------체크박스------------------------
  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = orderData?.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.order_product_id === product.order_product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.order_product_id !== product.order_product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if (selectedItems.length + 1 === orderData?.length) {
        setSelectAll(true);
      }
    }
  };


  /*---------- 필터 검색 ----------*/
  
  /**
   * @필터 POST FETCH 
   * - 필터 검색 Mutation (react-query :: Mutation Hook) 사용
   * @param {*} filter 객체 정보
   * - date: {start: '', end: ''} - 시작 날짜와 끝 날짜 필터
   * - raeDateType: "" - 색인할 날짜 타입 필터
   * - raeState: "" - rae State에 따른 필터
   * - selectFilter: "" - 상세 필터
   * - filterValue: "" - 상세 필터 조건
   */
  const fetchFilteredRae = async (filter) => {
    return await fetchServer(filter, `post`, `/order/rae/filter`, 1);
  };

  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredRae })

  /**
   * @검색 Mutation 선언부

   * @returns 필터된 상품의 데이터 객체 (@불러오기 returns 데이터 정보 참조)
   */
  const handleSearch = (filter) => {

    // 검색 버튼 클릭 시에만 서버에 요청
    filterMutation(filter, {
      onSuccess: (data) => {
        alert(data.message)
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['orderRefund'], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })  };

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart" /> 반품신청</h1>
      </div>
      {/* 필터 */}
      <TackBackFilter handleSearch={handleSearch}/>
      {/* 테이블 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <button
          className="original_round_button"
          onClick={() => { addRequest(selectedItems) }}
        >일괄 신청</button>
      </div>
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>주문일자</th>
              <th>브랜드</th>
              <th>상품코드</th>
              <th>상품명</th>
              <th>규격</th>
              <th>옵션</th>
              <th>상품 단가</th>
              <th>반품가능 수량</th>
              <th>반품가능 금액</th>
              <th>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={() => handleSelectAllChange()} />
              </th>
            </tr>
          </thead>
          {orderData && orderData.map((item, index) => (
            <tbody key={index}>
              <tr>
                <td>{index + 1}</td>
                <td>{new Date(item.order_date).toLocaleString()}</td>
                <td>{item.product_brand}</td>
                <td>{item.product_id}</td>
                <td>{item.product_title}</td>
                <td>{item.product_spec}</td>
                <td>{item.selectedOption ? item.selectedOption : '없음'}</td>
                <td>{(item.order_productPrice / item.order_cnt).toLocaleString()}</td>
                <td>{item.order_cnt}</td>
                <td>{parseInt(item.order_productPrice).toLocaleString()}</td>
                <td>
                  <input
                    checked={selectedItems.some(select => select.order_product_id === item.order_product_id)}
                    onChange={() => checkedBox(item)}
                    type='checkbox'
                  />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      {/* --------------TakeBack-Modal-------------- */}
      {isModal &&
        <div className={styles.modalOverlay}>
          <TakeBackModal modalItem={modalItem} />
        </div>}
    </div>
  )
}