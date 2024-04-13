import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeliveryFilter, useModalActions, useModalState } from '../../../../store/DataStore';
import styles from './DeliList.module.css';
import axios from '../../../../axios';
import { GetCookie } from '../../../../customFn/GetCookie';
import DeliFilter from '../Filter/DeliFilter';
import DeliStateModal from './DeliStateModal';
import DeliInvoiceModal from './DeliInvoiceModal';
import Pagination from '../../../../customFn/Pagination';
import { useMutation } from '@tanstack/react-query';
import { useFetch } from '../../../../customFn/useFetch';


export default function DeliList() {

  // Modal 관련 Zustand
  const { isModal, modalName } = useModalState(); // isModal: 모달 상태 저장 | modalName: 선택한 모달 저장
  const { selectedModalOpen } = useModalActions();; // 모달 오픈 Fn

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 렌더링 될 개수
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 개수

  // Fetch 관련 customFn
  const { fetchServer } = useFetch();

  // Delivery 관련 Zustand\
  const { deliveryFilter } = useDeliveryFilter();

  // queryClient
  const queryClient = useQueryClient();



  // FetchData
  const fetchDeliveryData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/delivery/all`, {
        params: {
          page: currentPage,
          pagePosts: itemsPerPage
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response.data.message);
      return response.data.data.data;
    } catch (error) {
      throw new Error('배송 데이터 불러오기 중 오류가 발생하였습니다.');
    }
  }
  // useEffect를 사용하여 페이지 번호나 페이지 당 항목 수가 변경될 때마다 새로운 데이터를 가져옴
  useEffect(() => {
    fetchDeliveryData();
  }, [currentPage, itemsPerPage]);
  // 데이터 상태 관리
  const { isLoading, isError, error, data: deliveryData } = useQuery({
    queryKey: [`delivery`, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchDeliveryData,
  });

  // 업데이트된 데이터의 체크 상태를 관리하는 state
  const [checkedItems, setCheckedItems] = useState([]);

  // 배송상태 파싱
  function parseDeliveryState(val) {
    const parseVal = parseInt(val);
    switch (parseVal) {
      case 2:
        return '배송 준비';
      case 3:
        return '배송 중';
      case 4:
        return '배송 완료';
      default:
        alert('배송 상태를 불러들이지 못했습니다.');
        return 'null';
    }
  }

  // 택배사 파싱
  function parseSelectedCor(val) {
    switch (val) {
      case "성동택배":
        return "성동택배";
      case "대한통운":
        return "대한통운";
      case "롯데택배":
        return "롯데택배";
      case "kr.daesin":
        return "대신화물";
      case "kr.kdexp":
        return "경동화물";
      default:
        return "미정";
    }
  }

  // 전체 체크박스 업데이트
  function handleAllCheckbox(e) {
    const checked = e.target.checked;

    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      let idArray = deliveryData.map((item) => item.order_id);
      setCheckedItems(idArray);
    } else {
      // 모두 체킹 해제
      setCheckedItems([]);
    }
  }

  /**
   * @기능 체크박스 개별 업데이트
   * @설명 체크된 아이템의 order_id를 배열에 추가/삭제 합니다.
   * @param {*} checked 
   * @param {*} order_id 
   */
  function handlePerCheckbox(checked, order_id) {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckedItems(prev => [...prev, order_id]);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckedItems(checkedItems.filter((el) => el !== order_id));
    }
  }

  // 배송 상태 변경 모달 열기 조건 확인
  /**
   * @기능 배송 상태변경 모달오픈 시, 검사
   * @설명 모달의 name을 전달받아 체크된 체크박스의 개수(checkedItems.length)가 1개 이상 있으면 해당 모달이 열리도록 합니다.
   * @param {*} name 
   */
  const handleModalOpen = (name) => {
    if (checkedItems.length > 0) {
      selectedModalOpen(name); // 선택된 아이템이 있으면 배송 상태 변경 모달 열기
    } else {
      alert('아이템을 선택하세요.'); // 선택된 아이템이 없으면 경고 메시지 표시
    }
  };

  // 삭제
  // 진행 절차: mutation호출 -> mutationFn실행
  const deleteData = async () => {
    if (window.confirm('삭제를 진행하시겠습니까?')) {
      console.log(checkedItems);
      try {
        const token = GetCookie('jwt_token');
        const response = await axios.delete(`/delivery/deliveries/cancellation/${checkedItems}`, {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });

        // 성공 시 삭제된 데이터를 반환
        if (response.status === 200) {
          window.location.reload(); // 성공했을 때만 페이지를 새로 고침
          return response.data;
        }
      } catch (error) {
        console.error('데이터 삭제 중 에러 발생:', error);
        throw error; // 에러를 다시 던져서 호출자에게 알릴 수 있습니다.
      }
    }
  };

  /**
   * 
   * @param {Object} filter 
   * @returns {Object} 필터링된 객체 리턴
   */
  const fetchFilterdList = async (filter) => {
    console.log(filter);
    return await fetchServer(filter, `post`, `/delivery/filter`, currentPage)
  }

  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilterdList });

  const handleSearch = () => {
    // 코드를 작성하기 쉽게 알맞는 변수명에 재할당
    const startDate = deliveryFilter.date.start;
    const endDate = deliveryFilter.date.end;
    const checkboxTrueKeys = Object.keys(deliveryFilter.checkboxState).filter(key => deliveryFilter.checkboxState[key] === true);
    const isCheckDateIsFull = startDate && endDate;

    /**예외처리
     * - 체크박스가 선택됨
     * - 날짜(시작일, 종료일 모두) 지정됨
     * 위 두 경우가 아니면 모두 예외처리
     * 즉, 필터링 항목이 모두 비어있지 않다면 필터링Fn을 실행
     */
    if (checkboxTrueKeys.length > 0 || isCheckDateIsFull) {
      console.log(`Fetch전 최종 delivereyFilter 검사: ${JSON.stringify(deliveryFilter)}`);
      filterMutation(deliveryFilter, {
        onSuccess: (data) => {
          alert(data.message);
          setCurrentPage(data.data.currentPage);
          setTotalPages(data.data.totalPages);
          queryClient.setQueryData([`delivery`, currentPage, itemsPerPage], () => {
            return data.data.data
          })
        },
        onError: (error) => {
          return console.error(error.message);
        }
      })
    }
    else {
      alert("항목이 모두 비었습니다. 필터링 항목을 선택 혹은 입력해주세요");
      return;
    }
  }

  /**
   * 맨 앞에 달러 기호와 천 단위 구분 기호를 붙여 파싱해주는 함수.
   * @param {*} item 
   * @returns 
   */
  const parseLacalToString = (item) => {
    const parseToLocaleString = Number(item).toLocaleString('kr-KR', { style: 'currency', currency: 'KRW' });
    return parseToLocaleString;
  }


  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className={styles.body}>
      {/* Post */}
      <div className='LargeHeader'>배송 상태 관리</div>

      {/* Filter Container */}
      <DeliFilter handleSearch={handleSearch} parseDeliveryState={parseDeliveryState} />

      {/* Header */}
      <div className='MediumHeader'>
        <div className='HeaderTxt'>
          목록
        </div>
        <select
          className='select'
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>
      {/* 선택항목일괄처리 */}
      <div className={styles.selectedHandler}>
        {[
          { item: '선택항목 상태 수정', function: () => handleModalOpen('DeliveryStateModal') },
          { item: '선택항목 송장 입력/수정', function: () => handleModalOpen('InvoiceModal') },
          { item: '선택항목 배송 취소(삭제)', function: () => deleteData() },
        ].map((item, index) => {
          return (
            <button
              className='white_button'
              onClick={item.function}
              key={index}>
              {item.item}
            </button>
          );
        })}

      </div>
      {/* Main - 배송관리 테이블 리스트업 */}
      <table>
        {/* 필드명 */}
        <thead>
          <tr>
            <th>
              <input type='checkbox'
                checked={checkedItems.length === deliveryData.length ? true : false}
                onChange={(e) => handleAllCheckbox(e)} />
            </th>
            <th>주문번호</th>
            <th>상호명</th>
            <th>택배사</th>
            <th>송장 번호</th>
            <th>처리상태</th>
            <th>주문일자</th>
            <th>상품코드</th>
            <th colSpan={2}>상품명</th>
            <th>옵션명</th>
            <th>표준가</th>
            <th>주문량</th>
            <th>공급가</th>
          </tr>
        </thead>
        {/* 데이터 맵핑 */}
        <tbody>
          {
            deliveryData?.map((item, index) => (
              <tr key={index}>
                {/* 체크박스 */}
                <td><input
                  type='checkbox'
                  checked={checkedItems.includes(item.order_id) ? true : false}
                  onChange={(e) => handlePerCheckbox(e.target.checked, item.order_id)} /></td>
                {/* 주문번호 */}
                <td>{item.order_id}</td>
                {/* 상호명 */}
                <td>{item.cor_corName}</td>
                {/* 택배사 */}
                <td>{parseSelectedCor(item.delivery_selectedCor)}</td>
                {/* 송장 번호 */}
                <td>{item.delivery_num == '' ? '입력 필요' : item.delivery_num}</td>
                {/* 배송상태 */}
                <td>{parseDeliveryState(item?.orderState)}</td>
                {/* 주문일자 */}
                <td>{item.order_date}</td>
                {/* 상품번호 */}
                <td>{item.product_id}</td>
                {/* 상품명 */}
                <td colSpan={2}>{item.product_title}</td>
                {/* 옵션 상세 - 선택 옵션이 있을 경우만 표시*/}
                <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                {/* 표준가 */}
                <td>{parseLacalToString(item.product_price)}</td>
                {/* 주문량 */}
                <td>{item.order_cnt.toLocaleString('ko-KR')}</td>
                {/* 공급가 */}
                <td>{parseLacalToString(item.discountPrice)}</td>

              </tr>
            ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50px', fontSize: '14px' }}>
          {/* 페이지 이동 컴포넌트 */}
          <Pagination
            currentPage={currentPage}
            totalPages={deliveryData.totalPages}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </div>
      </div>

      {/* 배송 상태 변경 모달 */}
      {
        isModal && modalName === 'DeliveryStateModal'
          ?
          <DeliStateModal
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            deliveryData={deliveryData}
          />
          :
          null
      }
      {/* 송장 변경 모달 */}
      {
        isModal && modalName === 'InvoiceModal'
          ?
          <DeliInvoiceModal
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            parseDeliveryState={parseDeliveryState}
            deliveryData={deliveryData}
          />
          :
          null
      }
    </div>
  );
}