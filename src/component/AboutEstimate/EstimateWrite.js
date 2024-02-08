import axios from '../../axios';
import styles from './Table.module.css';
import { GetCookie } from '../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useEstimateActions, useEstimateData, useEstimateProductData, useUserData } from '../../Store/DataStore';
import { useFetch } from '../../customFn/useFetch';
export function EstimateWrite() {
  const estimateData = useEstimateProductData();
  const estimateInputData = useEstimateData();
  const { setVendorData, setSupplierData } = useEstimateActions();
  const queryClient = useQueryClient();
  const { fetchServer } = useFetch();
  //fetch
  const { isLoading, isError, error, data: userData } = useQuery({queryKey: ['user']})

  function handleCancelButton() {
    const isConfirmed = window.confirm('정말로 취소하시겠습니까?\n현재까지 작성 내용은 저장되지 않습니다.');
    if (isConfirmed) {
      navigate("/");
    }
  }

  //정보 자동 입력
  useEffect(() => {
    if (userData) {
      setSupplierData("estimate_corName", userData.cor_corName);
      setSupplierData("estimate_cor_tel", userData.cor_tel);
      setSupplierData("estimate_email", userData.email);
      setSupplierData("estimate_cor_fax", userData.cor_fax);
      setSupplierData("estimate_cor_ceoName", userData.cor_ceoName);
    }
  }, [userData]);

  const objVendorSupplier = (fieldType) => [
    { title: '거래처명', contents: supplierVendorInfo(fieldType, 'estimate_corName') },
    { title: '담당자명', contents: supplierVendorInfo(fieldType, 'estimate_managerName') },
    { title: '주소', contents: supplierVendorInfo(fieldType, 'estimate_address') },
    { title: '전화번호', contents: supplierVendorInfo(fieldType, 'estimate_cor_tel') },
    { title: '대표자명', contents: supplierVendorInfo(fieldType, 'estimate_cor_ceoName') },
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
                estimateData.value.length > 0 ?
                  estimateData.value.reduce((sum, item) =>
                    sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt)
                    , 0).toLocaleString('ko-KR')
                  : 0
              } disabled /> 원
              </td>
              <th>상품별 적용율</th>
              <td><input className={styles.input} /> %</td>
              <th rowSpan={6}>비고</th>
              <td rowSpan={6}><input type='textarea' className={styles.textArea} /></td>
            </tr>
            <tr>
              <th>총금액 할인율</th>
              <td><input className={styles.input} /> %</td>
              <th>총이익금액</th>
              <td><input className={styles.input} disabled /> 원</td>
            </tr>
            <tr>
              <th>총금액 할인금액</th>
              <td><input className={styles.input} /> 원</td>
              <th>부가세</th>
              <td>
                <input className={styles.input} value={estimateData.value.length > 0 ?
                  parseInt(estimateData.value.reduce((sum, item) =>
                    sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt) / 10
                    , 0)).toLocaleString('ko-kr')
                  : 0} disabled /> 원
              </td>
            </tr>
            <tr>
              <th>최종금액</th>
              <td><input className={styles.input} value={parseInt(estimateData.value.reduce((sum, item) =>
                sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt)
                , 0)).toLocaleString('ko-kr')} disabled /> 원</td>
              <th>최종금액+부가세</th>
              <td>
                <input className={styles.input} value={estimateData.value.length > 0 ?
                  parseInt(parseInt(estimateData.value.reduce((sum, item) =>
                    sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt)
                    , 0)) +
                    parseInt(estimateData.value.reduce((sum, item) =>
                      sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt) / 10
                      , 0))).toLocaleString('ko-kr')
                  : 0} disabled /> 원
              </td>
            </tr>
            <tr>
              <th>견적 유효기간</th>
              <td><input className={styles.input} type='date' /></td>
              <th>부가세 구분</th>
              <td>
                <label><input type="radio" name="VAT" />부가세 포함</label>
                <label><input type="radio" name="VAT" />부가세 별도</label>
              </td>
            </tr>
            <tr>
              <th>견적 작성일자</th>
              <td><input className={styles.input} type='date' /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 견적 상품 */}
      <div className={styles.buttonBox}>
        <span>납기일 :</span><input className={styles.input} style={{ width: '7em' }} />일
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
            </tr>
          </thead>
          <tbody>
            {estimateData.value.map((item, index) => (
              <React.Fragment key={index}>
                <tr className={styles.list}>
                  <td>{index + 1}</td>
                  <td>성동상품</td>
                  <td>{item.product_id}</td>
                  <td>{item.product_title}</td>
                  <td>{item.product_brand}</td>
                  <td>{item.product_spec}</td>
                  <td>EA</td>
                  <td>{item.estimateBox_cnt}</td>
                  <td>
                    {item.product_discount
                      ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    {item.product_discount
                      ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                        .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    적용율%
                  </td>
                  <td>
                    {item.product_discount
                      ? `${(parseInt((item.estimateBox_price) * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.estimateBox_price * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}                  </td>
                  <td>
                    {item.product_discount
                      ? `${(parseInt((item.estimateBox_price) * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                      : `${parseInt(item.estimateBox_price * item.estimateBox_cnt).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                  </td>
                  <td>
                    이익금액
                  </td>
                  <td>
                    납기일
                  </td>
                  <td>
                    비고
                  </td>
                  <td>
                    내품정보
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
              <td>합계</td>
              <td></td>
              <td>{estimateData.value.length}(건)</td>
              <td></td>
              <td>{estimateData.value.reduce((sum, item) => sum + parseInt(item.estimateBox_cnt), 0)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ fontWeight: '850' }}>
                {
                  estimateData.value.length > 0 ?
                    estimateData.value.reduce((sum, item) =>
                      sum + parseInt((item.estimateBox_price * item.estimateBox_cnt) - (item.estimateBox_price / 100) * item.product_discount * item.estimateBox_cnt)
                      , 0).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
                    : 0
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className={styles.buttonContainer}>
        <button className="original_button">작성 완료 및 출력</button>
        <button className={styles.pageButton} onClick={() => handleCancelButton()}>취소</button>
      </div>
    </div>
  )
}