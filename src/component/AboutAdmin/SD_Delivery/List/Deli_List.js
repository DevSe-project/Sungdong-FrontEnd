import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../../Store/DataStore';
import styles from './Deli_List.module.css';
import axios from '../../../../axios';
import { GetCookie } from '../../../../customFn/GetCookie';
import Deli_StateModal from './Deli_StateModal';
import Deli_InvoiceModal from './Deli_InvoiceModal';
import { useFetch } from '../../../../customFn/useFetch';
import { createRoutesFromChildren } from 'react-router-dom';
import Pagination from '../../../../customFn/Pagination';


export default function Deli_List() {

  // relative modal state
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen } = useModalActions();;

  const [postData, setPostData] = useState([]);

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const { fetchGetAddPostServer } = useFetch();

  const fetchingData = async () => {
    const data = await fetchGetAddPostServer(`/delivery/all`, currentPage, itemsPerPage);
    return data;
  }

  // useEffect를 사용하여 페이지 번호나 페이지 당 항목 수가 변경될 때마다 새로운 데이터를 가져옴
  useEffect(() => {
    fetchingData();
  }, [currentPage, itemsPerPage]);
  // 데이터 상태 관리
  const { isLoading, isError, error, data: deliveryData } = useQuery({
    queryKey: [`delivery`], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchingData,
  });

  // 업데이트된 데이터의 체크 상태를 관리하는 state
  const [checkedItems, setCheckedItems] = useState([]);

  // 배송상태 파싱
  function parseDeliveryState(val) {
    console.log(val);
    const parseVal = parseInt(val);
    switch (parseVal) {
      case 0:
        return '결제 대기';
      case 1:
        return '결제 완료';
      case 2:
        return '배송 준비';
      case 3:
        return '배송 중';
      case 4:
        return '배송 완료';
      case 5:
        return '배송 지연';
      default:
        alert('배송 상태를 불러들이지 못했습니다.');
        return 'null';
    }
  }

  // 전체 체크박스 업데이트
  function handleAllCheckbox(e) {
    const checked = e.target.checked;

    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      let idArray = deliveryData.data.map((item) => item.order_id);
      setCheckedItems(idArray);
    } else {
      // 모두 체킹 해제
      setCheckedItems([]);
    }
  }

  // 체크박스 개별 업데이트
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
  const handleModalOpen = (name) => {
    if (checkedItems.length > 0) {
      selectedModalOpen(name); // 선택된 아이템이 있으면 배송 상태 변경 모달 열기
    } else {
      alert('아이템을 선택하세요.'); // 선택된 아이템이 없으면 경고 메시지 표시
    }
  };

  // 삭제
  const deleteData = async () => {
    if (window.confirm('삭제를 진행하시겠습니까?')) {
      console.log(checkedItems);
      try {
        const token = GetCookie('jwt_token');
        const response = await axios.delete(`/delivery/deliveries/delete/${checkedItems}`, {
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

  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div style={{ width: '100%' }}>
      {deliveryData ?
        <div className={styles.body}>
          {/* Header */}
          <div className='MediumHeader'>
            <div className='HeaderTxt'>
              목록
            </div>
            <select
              className='select'
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                    checked={checkedItems.length === deliveryData.data.length ? true : false}
                    onChange={(e) => handleAllCheckbox(e)} />
                </th>
                <th>주문번호</th>
                <th>택배사</th>
                <th>송장 번호</th>
                <th>처리상태</th>
                <th>주문일자</th>
                <th>상품코드</th>
                <th>상품명</th>
                <th>옵션명</th>
                <th>표준가</th>
                <th>공급가</th>
              </tr>
            </thead>
            {/* 데이터 맵핑 */}
            <tbody>
              {
                deliveryData?.data.map((item, index) => (
                  <tr key={index}>
                    {/* 체크박스 */}
                    <td><input
                      type='checkbox'
                      checked={checkedItems.includes(item.order_id) ? true : false}
                      onChange={(e) => handlePerCheckbox(e.target.checked, item.order_id)} /></td>
                    {/* 주문번호 */}
                    <td>{item.order_id}</td>
                    {/* 택배사 */}
                    <td>{item.delivery_selectedCor}</td>
                    {/* 송장 번호 */}
                    <td>{item.delivery_num == '' ? '입력 필요' : item.delivery_num}</td>
                    {/* 배송상태 */}
                    <td>{parseDeliveryState(item.orderState)}</td>
                    {/* 주문일자 */}
                    <td>{item.order_date}</td>
                    {/* 상품번호 */}
                    <td>{item.product_id}</td>
                    {/* 상품명 */}
                    <td>{item.product_title}</td>
                    {/* 옵션 상세 - 선택 옵션이 있을 경우만 표시*/}
                    <td>{item.optionSelected ? item.optionSelected : "-"}</td>
                    {/* 표준가 */}
                    <td>{item.product_price}</td>
                    {/* 공급가 */}
                    <td>{item.discountPrice}</td>
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
              <Deli_StateModal
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
                deliveryData={deliveryData.data}
              />
              :
              null
          }
          {/* 송장 변경 모달 */}
          {
            isModal && modalName === 'InvoiceModal'
              ?
              <Deli_InvoiceModal
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
                parseDeliveryState={parseDeliveryState}
                deliveryData={deliveryData.data}
              />
              :
              null
          }
        </div>
        :
        <p>정보를 불러오지 못했습니다.</p>}
    </div>
  );
}
