import axios from '../../axios';
import styles from './Table.module.css';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDataActions, useEstimateActions, useEstimateList, useListActions } from '../../store/DataStore';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination';
export function EstimateBox() {
  const [selectedItems, setSelectedItems] = useState([]);
  const estimateList = useEstimateList();
  const {setProductData} = useEstimateActions();
  const { setEstimateList, resetEstimateList, setEstimateCnt, setEstimateCntUp, setEstimateCntDown } = useListActions();
  const queryClient = useQueryClient();
  const { fetchServer, fetchGetServer } = useFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //fetch
  const fetchData = async () => {
    const data = await fetchGetServer(`/estimate/list`, 1);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  }

  const { isLoading, isError, error, data: estiData } = useQuery({ queryKey: ['estimateBox'], queryFn: () => fetchData() });

  useEffect(() => {
    if(estiData)
      setEstimateList(estiData);
  }, [estiData])

  //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/estimate/list', pageNumber);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['estimateBox'], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //--------------------------------------------------------------------

  const navigate = useNavigate();

    // 전체 선택 체크박스 상태를 저장할 상태 변수
    const [selectAll, setSelectAll] = useState(false);

    // 전체 선택 체크박스 클릭 시 호출되는 함수
    function handleSelectAllChange() {
      setSelectAll(!selectAll);
  
      if (!selectAll) {
        const allId = estiData && estimateList?.map((item) => item);
        setSelectedItems(allId);
      } else {
        setSelectedItems([]);
      }
    };


  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.estimateBox_product_id === product.estimateBox_product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.estimateBox_product_id !== product.estimateBox_product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false); // 선택 해제될 때 부모 체크박스 해제
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if (selectedItems.length + 1 === estimateList?.length) { 
        // 내부 체크박스가 모두 선택되었는지 확인
        setSelectAll(true)
      }
    }
  };


  //장바구니 추가 함수
  const addToCart = async (product) => {
    return await fetchServer(product, `post`, `/cart/create`, 1)
  };

  //장바구니 추가 함수
  const { mutate: basketMutation } = useMutation({ mutationFn: addToCart });

  function basketRelatedData() {
    if (selectedItems.length === 0) {
      alert("먼저 담을 상품을 체크해주세요!");
      return;
    }

    basketMutation(selectedItems, {
      onSuccess: (cartData) => {
        // 메세지 표시
        alert(cartData.message);
        console.log('상품이 장바구니에 추가되었습니다.', cartData);
        // 장바구니 상태를 다시 불러와 갱신합니다.
        queryClient.invalidateQueries(['cart']);
        // 장바구니로 이동
        navigate("/basket");
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 장바구니에 추가하는 중 오류가 발생했습니다.', error);
      },
    })// 상품을 장바구니에 추가하는 것을 호출    
  }

  function handleEstimateWrite() {
    if (selectedItems.length === 0) {
      alert("먼저 담을 상품을 체크해주세요!");
      return;
    }

    setProductData(selectedItems);
    navigate("/estimateWrite");
  }

  // --------- 수량 변경 부분 ----------

  // 수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e, prevItem) => {
    const lengthTarget = e.target.value;

    if (lengthTarget >= 0 && lengthTarget.length <= 3) {
      const isSelected = selectedItems.some(item => item.estimateBox_product_id === prevItem.estimateBox_product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.estimateBox_product_id !== prevItem.estimateBox_product_id));
        setEstimateCnt(prevItem, lengthTarget);
      } else {
        setEstimateCnt(prevItem, lengthTarget);
      }
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    if (prevItem.estimateBox_cnt > 1) {
      const isSelected = selectedItems.some(item => item.estimateBox_product_id === prevItem.estimateBox_product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.estimateBox_product_id !== prevItem.estimateBox_product_id));
        setEstimateCntDown(prevItem);
      }
      else {
        setEstimateCntDown(prevItem);
      }
    } else {
      alert("수량은 1보다 커야합니다.");
      return prevItem; // 1이하로 내릴 수 없으면 기존 아이템 반환
    }
  }


  // 수량 UP
  function handleAddItem(prevItem) {
    if (prevItem.estimateBox_cnt < 999) {
      const isSelected = selectedItems.some(item => item.estimateBox_product_id === prevItem.estimateBox_product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.estimateBox_product_id !== prevItem.estimateBox_product_id));
        setEstimateCntUp(prevItem);
      } else {
        setEstimateCntUp(prevItem);
      }
    } else {
      alert("수량은 999보다 작아야합니다.");
      return prevItem; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
    }
  }

  //-------------------상품삭제--------------------

  const fetchDeletedProducts = async (productId) => {
    try {
      const response = await axios.delete(`/estimate/delete/${productId}`,
      )
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 상품 삭제를 처리하는 뮤테이션
  const { mutate: deleteProductMutation } = useMutation({ mutationFn: fetchDeletedProducts })

  //상품 목록 삭제 함수
  const deletedList = () => {
    const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
    if (isConfirmed) {
      const itemsId = selectedItems.map(item => item.estimateBox_product_id)
      deleteProductMutation(itemsId, {
        onSuccess: (data) => {
          alert(data.message);
          // 상품 삭제 성공 시 상품 목록을 다시 불러옴
          queryClient.invalidateQueries(['estimateBox']);
          window.location.reload();
        },
        onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          alert(error.message);
        },
      });
    }
  };

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
        <h1><i className="fa-solid fa-heart" /> 견적함</h1>
      </div>
      <div className={styles.buttonBox}>
        <button className="white_button" onClick={() => navigate("/basket")}>
          장바구니 이동
        </button>
        <button className="white_button" onClick={() => basketRelatedData()}>
          선택 항목 장바구니 추가
        </button>
      </div>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead
            style={{ height: '5em', backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            <tr>
              <th rowSpan={2}>이미지</th>
              <th>상품코드</th>
              <th>품명</th>
              <th>브랜드</th>
              <th>단위</th>
              <th>표준가</th>
              <th style={{ fontWeight: '650' }}>공급단가</th>
              <th rowSpan={2}>수량</th>
              <th rowSpan={2}>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={() => handleSelectAllChange()} />
              </th>
            </tr>
            <tr>
              <th>규격</th>
              <th>모델명</th>
              <th>옵션</th>
              <th>적용률</th>
              <th>할인금액</th>
              <th>공급가</th>
            </tr>
          </thead>
          <tbody>
            {estiData && estimateList?.map((item, index) => (
              <React.Fragment key={index}>
                <tr className={styles.list}>
                  <td rowSpan={2}><img className={styles.thumnail} src={item.product_image_original} alt='이미지'></img></td>
                  <td>{item.product_id}</td>
                  <td
                    className={styles.detailView}
                    style={{ fontSize: '1.1em', fontWeight: '550' }}
                    onClick={() => navigate(`/detail/${item.product_id}`)}>
                    {item.product_title}
                  </td>
                  <td>
                    <h5>{item.product_brand}</h5>
                  </td>
                  <td>EA</td>
                  <td>
                    {parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ fontWeight: '750' }}>
                    {parseInt(item.estimateBox_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ width: '15%', whiteSpace: 'nowrap'}} rowSpan={2}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleDelItem(item)}
                    >
                      -
                    </button>
                    <input value={item.estimateBox_cnt} className={styles.inputCnt} onChange={(e) => maxLengthCheck(e, item)} type='text' placeholder='숫자만 입력' />
                    <button
                      className={styles.editButton}
                      onClick={() => handleAddItem(item)}
                    >
                      +
                    </button>
                  </td>
                  <td rowSpan={2}>
                    <input
                      checked={selectedItems.includes(item)}
                      onChange={() => checkedBox(item)}
                      type='checkbox'
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    {item.product_spec}
                  </td>
                  <td>
                    {item.product_model}
                  </td>
                  <td>
                    {item.estimateBox_selectedOption}
                  </td>
                  <td>
                    {100 - parseFloat(item.estimateBox_discount)}%
                  </td>
                  <td style={{ fontWeight: '550' }}>
                    {((item.product_price - item.estimateBox_price) * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ fontWeight: '750' }}>
                      {parseInt(item.estimateBox_price * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                </tr>
              </React.Fragment>
            ))
            }
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={2} rowSpan={2}>합계</th>
              <th colSpan={4} rowSpan={2}></th>
              <th style={{ height: '3em' }}>총 공급가액</th>
              <th rowSpan={2} colSpan={2}></th>
            </tr>
            <tr>
              <td style={{ fontWeight: '850' }}>
                {
                  selectedItems.length > 0 ?
                    selectedItems.reduce((sum, item) =>
                      sum + parseInt(item.estimateBox_price * item.estimateBox_cnt)
                      , 0).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                    : 0
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <div className={styles.buttonContainer}>
        <button className={styles.pageButton} onClick={() => handleEstimateWrite()}>견적 작성하기</button>
        <button className={styles.pageButton} onClick={() => deletedList()}>삭제</button>
      </div>
    </div>
  )
}