import axios from '../../axios';
import styles from './Table.module.css';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useEstimateActions, useEstimateData, useEstimateProductData, useEstimateStore, useUserData } from '../../Store/DataStore';
import { useFetch } from '../../customFn/useFetch';
export function EstimateWrite() {
  const estimateData = useEstimateProductData();
  const estimateInputData = useEstimateData();
  const { setVendorData, setSupplierData, setEstimateData, setProfit } = useEstimateActions();
  const queryClient = useQueryClient();
  const { fetchServer } = useFetch();
  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  //금액 관련 변수
  const priceOne = (item) => item.estimateBox_price - item.estimateBox_price * (item.product_discount / 100);
  const price = (item) => item.estimateBox_price * item.estimateBox_cnt - item.estimateBox_price * (item.product_discount / 100) * item.estimateBox_cnt;
  const profit = (item) => ((item.estimateBox_price - (item.estimateBox_price * (item.product_discount / 100))) * (item.product_profit / 100))
  const totalAmount = estimateData.reduce((sum, item) => sum + parseInt(price(item)) + profit(item) * item.estimateBox_cnt, 0);
  const totalDiscount = totalAmount * (estimateInputData.estimate_amountDiscount / 100);
  const VAT = (totalAmount - totalDiscount) / 10;

  //fetch
  const { isLoading, isError, error, data: userData } = useQuery({ queryKey: ['user'] })

  function handleCancelButton() {
    const isConfirmed = window.confirm('정말로 취소하시겠습니까?\n현재까지 작성 내용은 저장되지 않습니다.');
    if (isConfirmed) {
      useEstimateStore.persist.clearStorage();
      window.location.reload();
      navigate("/");
    }
  }

  //유효기간 날짜 세팅
  function formatDate(dateString) {
    // dateString이 'YYYY-MM-DD' 형식이라고 가정합니다.
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getOneWeekLaterDate() {
    // 오늘 날짜를 가져옵니다.
    const today = new Date();
    // 일주일 후의 날짜를 구합니다.
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    // YYYY-MM-DD 형식으로 변환하여 반환합니다.
    const year = oneWeekLater.getFullYear();
    const month = String(oneWeekLater.getMonth() + 1).padStart(2, '0');
    const day = String(oneWeekLater.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 상태 리셋
      useEstimateStore.persist.clearStorage();
      window.location.reload();
    };
  }, []);

  //정보 자동 입력
  useEffect(() => {
    if (userData) {
      setSupplierData("estimate_corName", userData.cor_corName);
      setSupplierData("estimate_cor_tel", userData.cor_tel);
      setSupplierData("estimate_email", userData.email);
      setSupplierData("estimate_cor_fax", userData.cor_fax);
      setSupplierData("estimate_cor_ceoName", userData.cor_ceoName);
      setEstimateData("estimate_expire", getOneWeekLaterDate())
    }
  }, [userData]);

  const objVendorSupplier = (fieldType) => [
    { title: '거래처명', contents: supplierVendorInfo(fieldType, 'estimate_corName') },
    { title: '담당자명', contents: supplierVendorInfo(fieldType, 'estimate_managerName') },
    { title: '주소', contents: supplierVendorInfo(fieldType, 'estimate_address') },
    { title: '대표자명', contents: supplierVendorInfo(fieldType, 'estimate_cor_ceoName') },
    { title: '전화번호', contents: supplierVendorInfo(fieldType, 'estimate_cor_tel') },
    { title: 'FAX', contents: supplierVendorInfo(fieldType, 'estimate_cor_fax') },
    { title: 'E-Mail', contents: supplierVendorInfo(fieldType, 'estimate_email') },
  ]

  //반복되는 인풋란(주문) 렌더링
  const supplierVendorInfo = (fieldType, fieldKey) => {
    return (
      <input
        type="text"
        className={styles.input}
        value={fieldType === "피공급자" ? estimateInputData.vendor[fieldKey] : estimateInputData.supplier[fieldKey]}
        onChange={(e) => fieldType === "피공급자" ? handleVendorField(fieldKey, e.target.value) : handleSupplierField(fieldKey, e.target.value)}
      />
    );
  };

  const handleVendorField = (fieldName, value) => {
    // setOrderInformation 메서드를 사용하여 특정 필드를 변경
    setVendorData(fieldName, value);
  };

  const handleSupplierField = (fieldName, value) => {
    // setOrderInformation 메서드를 사용하여 특정 필드를 변경
    setSupplierData(fieldName, value);
  };

  //----------------------체크박스------------------------
  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = estimateData.map((item) => item);
      setSelectedItems(allId);
    } else {
      setSelectedItems([]);
    }
  };

  // 체크박스 클릭 시 호출되는 함수
  function checkedBox(product) {
    if (selectedItems.find(item => item.estimateBox_product_id === product.estimateBox_product_id)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
      setSelectedItems(selectedItems.filter((item) => item.estimateBox_product_id !== product.estimateBox_product_id)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      if (selectedItems.length + 1 === estimateData.length) {
        setSelectAll(true);
      }
    }
  };

  function addEachProduct(item, supplyCnt) {
    if (selectedItems.length < 1) {
      alert("먼저 적용률을 적용할 상품을 선택 후 입력해주세요!");
      return;
    }
    const numericValue = supplyCnt.replace(/\D/g, '');
    if (numericValue > -1 && numericValue <= 100) {
      setProfit(item, numericValue)
    } else {
      alert("0~100까지 적용이 가능합니다.");
      return;
    }
  }

  function addAmountDiscount(supplyCnt) {
    const numericValue = supplyCnt.replace(/\D/g, '');
    if (numericValue > -1 && numericValue <= 100) {
      setEstimateData("estimate_amountDiscount", numericValue)
    } else {
      alert("0~100까지 적용이 가능합니다.");
      return;
    }
  }

  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>{error.message}</p>
  }

  return (
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1>견적 작성</h1>
      </div>

      {/* 공급자와 공급받는자 작성란 */}
      <div className={styles.twoComponent}>
        <div className={styles.sideComponent}>
          <div style={{ display: 'flex' }}>
            <h5 style={{ fontWeight: '850', marginBottom: '0.5em' }}>공급 받는 자</h5>
          </div>
          <table className={styles.table}>
            <tr>
              <th>구분</th>
              <th>내용</th>
            </tr>
            {objVendorSupplier('피공급자').map((item =>
              <tr>
                <th>{item.title}</th>
                <td>{item.contents}</td>
              </tr>
            ))}
          </table>
        </div>
        <div className={styles.sideComponent}>
          <div style={{ display: 'flex' }}>
            <h5 style={{ fontWeight: '850', marginBottom: '0.5em' }}>공급자</h5>
          </div>
          <table className={styles.table}>
            <tr>
              <th>구분</th>
              <th>내용</th>
            </tr>
            {objVendorSupplier('공급자').map((item =>
              <tr>
                <th>{item.title}</th>
                <td>{item.contents}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>

      {/* 견적 작성내용 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>총금액</th>
              <td><input className={styles.input} value={
                parseInt(totalAmount).toLocaleString('ko-kr')
              } disabled /> 원
              </td>
              <th>상품별 적용율</th>
              <td><input className={styles.input} onChange={(e) => addEachProduct(selectedItems, e.target.value)} /> %</td>
              <th rowSpan={6}>비고</th>
              <td rowSpan={6}><textarea className={styles.textArea} onChange={(e) => setEstimateData("estimate_etc", e.target.value)} /></td>
            </tr>
            <tr>
              <th>총금액 할인율</th>
              <td><input className={styles.input} value={estimateInputData.estimate_amountDiscount} onChange={(e) => addAmountDiscount(e.target.value)} /> %</td>
              <th>총이익금액</th>
              <td><input className={styles.input} disabled value={
                ((parseInt(totalAmount - totalDiscount))
                  -
                  (parseInt(estimateData.reduce((sum, item) =>
                    sum + parseInt(price(item)), 0)))).toLocaleString('ko-kr')
              } /> 원</td>
            </tr>
            <tr>
              <th>총금액 할인금액</th>
              <td><input className={styles.input} value={
                parseInt(totalDiscount).toLocaleString('ko-KR')
              } disabled /> 원</td>
              {estimateInputData.estimate_isIncludeVAT !== 'true' &&
                <>
                  <th>부가세</th>
                  <td>
                    <input className={styles.input} value={estimateData.length > 0 ?
                      parseInt(VAT).toLocaleString('ko-kr')
                      : 0} disabled /> 원
                  </td>
                </>
              }
            </tr>
            <tr>
              <th>최종금액</th>
              <td><input className={styles.input} value={parseInt(totalAmount - totalDiscount).toLocaleString('ko-kr')} disabled /> 원</td>
              {estimateInputData.estimate_isIncludeVAT !== 'true' &&
                <>
                  <th>최종금액+부가세</th>
                  <td>
                    <input className={styles.input} value={
                      parseInt((totalAmount - totalDiscount) + VAT).toLocaleString('ko-kr')
                    } disabled /> 원
                  </td>
                </>
              }
            </tr>
            <tr>
              <th>견적 유효기간</th>
              <td><input className={styles.input} type='date' value={estimateInputData.estimate_expire} onChange={(e)=>setEstimateData("estimate_expire", formatDate(e.target.value))} /></td>
              <th>부가세 구분</th>
              <td>
                <label><input type="radio" name="VAT" value={"true"} onChange={(e) => setEstimateData("estimate_isIncludeVAT", e.target.value)} />부가세 포함</label>
                <label><input type="radio" name="VAT" value={"false"} onChange={(e) => setEstimateData("estimate_isIncludeVAT", e.target.value)} />부가세 별도</label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 견적 상품 */}
      <div className={styles.buttonBox}>
        <span>납기일 :</span><input className={styles.input} style={{ width: '7em' }} value={estimateInputData.estimate_due} onChange={(e) => setEstimateData("estimate_due", e.target.value)} />일
      </div>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>상품구분</th>
              <th>상품코드</th>
              <th>품명</th>
              <th>브랜드</th>
              <th>규격</th>
              <th>단위</th>
              <th>수량</th>
              <th>견적단가</th>
              <th>납품단가</th>
              <th>적용률</th>
              <th>견적금액</th>
              <th>납품금액</th>
              <th>이익금액</th>
              <th>납기일</th>
              <th>비고</th>
              <th>내품정보</th>
              <th>
                <input
                  type='checkbox'
                  checked={selectAll}
                  onChange={() => handleSelectAllChange()} />
              </th>
            </tr>
          </thead>
          <tbody>
            {estimateData.map((item, index) => (
              <React.Fragment key={index}>
                <tr className={styles.list}>
                  <td>{index + 1}</td>
                  <td>성동상품</td>
                  <td>{item.product_id}</td>
                  <td>{item.product_title}{item.estimateBox_selectedOption && `(${item.estimateBox_selectedOption})`}</td>
                  <td>{item.product_brand}</td>
                  <td>{item.product_spec}</td>
                  <td>EA</td>
                  <td>{item.estimateBox_cnt}</td>
                  <td>
                    {item.product_discount
                      ? `${priceOne(item)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    {item.product_discount
                      ? `${(priceOne(item) + profit(item))
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.estimateBox_price + profit(item)).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    {item.product_profit ? item.product_profit : item.product_profit = 0}%
                  </td>
                  <td>
                    {item.product_discount
                      ? `${(parseInt(price(item))).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.estimateBox_price * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    {`${parseInt(price(item) + profit(item) * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    {
                      (parseInt(price(item) + profit(item) * item.estimateBox_cnt)
                        -
                      parseInt(price(item))).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                    }
                  </td>
                  <td>
                    {estimateInputData.estimate_due ? estimateInputData.estimate_due : 0}일
                  </td>
                  <td>
                    <input className={styles.input}></input>
                  </td>
                  <td>
                    <input className={styles.input}></input>
                  </td>
                  <td>
                    <input
                      checked={selectedItems.some(select => select.estimateBox_product_id === item.estimateBox_product_id)}
                      onChange={() => checkedBox(item)}
                      type='checkbox'
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))
            }
            <tr>
              <td colSpan={17} rowSpan={5}></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ color: '#CC0000' }}>합계</td>
              <td></td>
              <td style={{ color: 'blue' }}>{estimateData.length}(건)</td>
              <td></td>
              <td style={{ color: 'blue' }}>{estimateData.reduce((sum, item) => sum + parseInt(item.estimateBox_cnt), 0)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ fontWeight: '850' }}>
                {
                  estimateData.length > 0 ?
                    estimateData.reduce((sum, item) =>
                      sum + parseInt(price(item) + profit(item) * item.estimateBox_cnt)
                      , 0).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                    : 0
                }
              </td>
              <td style={{ fontWeight: '850' }}>
                {
                  parseInt(totalAmount -
                    estimateData.reduce((sum, item) =>
                      sum + parseInt(price(item))
                      , 0)).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className={styles.buttonContainer}>
        <button className="original_button" onClick={()=>window.print()}>작성 완료 및 출력</button>
        <button className={styles.pageButton} onClick={() => handleCancelButton()}>취소</button>
      </div>
    </div>
  )
}