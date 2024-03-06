import { useEffect, useState } from 'react';
import styles from './RelatedData.module.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartList, useListActions } from '../../store/DataStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination';
export function RelatedData({detailData}) {

  const navigate = useNavigate();
  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //검색 결과 데이터 fetch
  const { fetchAddPostServer, fetchServer } = useFetch();
  const [relatedData, setRelatedData] = useState([]);
  const queryClient = useQueryClient();

  const fetchRelatedData = async () => {
    const data = await fetchServer(detailData, 'post', '/product/relate', 1);
    setCurrentPage(data.data.currentPage);
    setTotalPages(data.data.totalPages);

    return data.data.data;
  }

  useEffect(() => {
    const fetchData = async () => {
      if(detailData){
        const data = await fetchRelatedData();
        setRelatedData(data);
      }
    };
  
    fetchData();
  }, [detailData]);
  //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer(detailData, 'post', '/product/relate', pageNumber);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        setRelatedData(data.data.data);
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //------------------------------------------------------

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = relatedData.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.product_id === product.product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.product_id !== product.product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false); // 선택 해제될 때 부모 체크박스 해제
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if (selectedItems.length + 1 === relatedData.length) { 
        // 내부 체크박스가 모두 선택되었는지 확인
        setSelectAll(true)
      }
    }
  };

  //------ 옵션선택 ------
  const optionCreator = (item) => {
    let options = [];
    for (let i = 0; i < 10; i++) {
      options.push(item[`option${i}`])
    }
    return (
      <select 
      value={item.selectedOption}
      onChange={(e) => {
        const newValue = e.target.value;
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === item.product_id) {
            return { ...relatedItem, selectedOption: newValue };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      }}>
        <option value="">
          선택
        </option>
        {options.length > 0 && options.map((option, key) => {
          return (
            option !== "" &&
            <option key={key} value={option}>
              {(option !== null || option !== "") && option}
            </option>
          )
        })}
      </select>
    )
  }


  // --------- 수량 변경 부분 ----------

  // 수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e, prevItem) => {
    const lengthTarget = e.target.value;

    if (lengthTarget >= 0 && lengthTarget.length <= 3) {
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: lengthTarget };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      } else {
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: lengthTarget };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      }
    }
  };

  // 수량 DOWN
  function handleDelItem(prevItem) {
    if (prevItem.cnt > 1) {
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: (parseInt(relatedItem.cnt ? relatedItem.cnt : 0)-1) };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      }
      else {
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: parseInt(relatedItem.cnt ? relatedItem.cnt : 0)-1 };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      }
    } else {
      alert("수량은 1보다 커야합니다.");
      return prevItem; // 1이하로 내릴 수 없으면 기존 아이템 반환
    }
  }


  // 수량 UP
  function handleAddItem(prevItem) {
    if (prevItem.cnt < 999) {
      const isSelected = selectedItems.some(item => item.product_id === prevItem.product_id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(item => item.product_id !== prevItem.product_id));
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: parseInt(relatedItem.cnt ? relatedItem.cnt : 0)+1 };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      } else {
        const updatedRelatedData = relatedData.map((relatedItem) => {
          if (relatedItem.product_id === prevItem.product_id) {
            return { ...relatedItem, cnt: parseInt(relatedItem.cnt ? relatedItem.cnt : 0)+1 };
          }
          return relatedItem;
        });
        setRelatedData(updatedRelatedData);
      }
    } else {
      alert("수량은 999보다 작아야합니다.");
      return prevItem; // 999 이상으로 올릴 수 없으면 기존 아이템 반환
    }
  }
//-------------------장바구니 담기------------------------

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

    if (selectedItems.some((item) =>
      item.option0 !== '' && (item.selectedOption === undefined || item.selectedOption === null || item.selectedOption === ''))) {
      alert("필수 옵션을 선택해주세요!");
      return;
    }

    if (selectedItems.some((item) =>
    item.cnt === '')) {
    alert("수량을 선택해주세요!");
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
//-------------------------------------------
  return(
    <div>
      <div className={styles.buttonBox}>
        <button className={styles.button} onClick={()=> navigate("/basket")}>
          장바구니 이동
      </button>
        <button className={styles.button} onClick={()=>basketRelatedData()}>
          선택 항목 장바구니 추가
        </button>
      </div>
      <div className={styles.tableLocation}>
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
            {detailData && relatedData?.map((item, index) => (
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
                    {parseInt(item.product_price)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                    }
                  </td>
                  <td style={{ fontWeight: '750' }}>
                    {parseInt(item.product_amount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }} rowSpan={2}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleDelItem(item)}
                    >
                      -
                    </button>
                    <input value={item.cnt ? item.cnt : item.cnt = ''} className={styles.input} onChange={(e) => maxLengthCheck(e, item)} type='text' placeholder='숫자만 입력' />
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
                    {item.option0 === '' ? <span>옵션없음</span> : optionCreator(item)}
                  </td>
                  <td>
                    {100-parseFloat(item.discount_amount)}%
                  </td>
                  <td style={{ fontWeight: '550' }}>
                    {((item.product_price - item.product_amount) * (item.cnt ? item.cnt : 1))
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                  <td style={{ fontWeight: '750' }}>
                      {(item.product_amount * (item.cnt ? item.cnt : 1))
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                  </td>
                </tr>
              </React.Fragment>
            ))
            }
          </tbody>
        </table>
      </div>
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
  </div>
  )
}