import { forwardRef } from "react"
import styles from './Print.module.css'
import { useEstimateInfo, useEstimateProduct } from "../../store/DataStore";

const EstimatePrint = forwardRef((props, ref) => {
  const estimateData = useEstimateProduct();
  const estimateInfo = useEstimateInfo();
  //금액 관련 변수
  const profit = (item) => item.estimate_price * item.product_profit / 100
  const totalAmount = estimateData?.reduce((sum, item) => sum + (parseInt(item.estimate_price) + profit(item)) * item.estimate_cnt, 0);
  const totalDiscount = totalAmount * (estimateInfo?.estimate_amountDiscount / 100);
  const VAT = (totalAmount - totalDiscount) / 10;

  return (
    <section ref={ref}>
      <div className={styles.header}>
        <h1 style={{ fontSize: '30px', fontWeight: '850' }}>견  적  서</h1>
        <h1 style={{ fontSize: '30px', fontWeight: '850' }}>{estimateInfo?.estimate_supplier_corName}</h1>
      </div>
      <div className={styles.header}>
        <div className={styles.body}>
          <div className={styles.inputInfo}>
            <div className={styles.mainInfo}>
              <span>{estimateInfo?.estimate_vendor_corName}</span>
            </div>
            <div className={styles.footerInfo}>
              <span>귀중</span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.mainInfo}>
              <span>{estimateInfo?.estimate_vendor_managerName}</span>
            </div>
            <div className={styles.footerInfo}>
              <span>귀하</span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>견적일 : </span>
            </div>
            <div className={styles.bodyInfo}>
              <span style={{ whiteSpace: 'nowrap' }}>{new Date(estimateInfo?.estimate_date).toLocaleDateString()} (유효기간 : {new Date(estimateInfo?.estimate_expire).toLocaleDateString()})</span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>합계금액 : </span>
            </div>
            <div className={styles.mainInfo} style={{ width: '65%' }}>
              <span>
                {parseInt(totalAmount).toLocaleString('ko-kr')}
              </span>
            </div>
            <div className={styles.footerInfo}>
              <span style={{ whiteSpace: 'nowrap' }}>{estimateInfo?.estimate_isIncludeVAT === 'true' ? "(VAT 포함)" : "(VAT 별도)"}</span>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>T E L : </span>
            </div>
            <div className={styles.mainInfo} style={{ width: '65%' }}>
              <span>
                {estimateInfo?.estimate_supplier_cor_tel}
              </span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>F A X : </span>
            </div>
            <div className={styles.mainInfo} style={{ width: '65%' }}>
              <span>
                {estimateInfo?.estimate_supplier_cor_fax}
              </span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>담당자 연락처 : </span>
            </div>
            <div className={styles.mainInfo} style={{ width: '65%' }}>
              <span>
                {props.manager_tel}
              </span>
            </div>
          </div>
          <div className={styles.inputInfo}>
            <div className={styles.headerInfo}>
              <span>담당자 : </span>
            </div>
            <div className={styles.mainInfo} style={{ width: '65%' }}>
              <span>
                {estimateInfo?.estimate_supplier_managerName}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '99.9%', height: '100%', marginTop: '1em', border: '1px solid black' }}>
        <div style={{ width: '100%', height: '10em', borderBottom: '1px solid black' }}>
          <div>
            <span>[기타] </span>
          </div>
          <div className={styles.mainInfo}>
            <span>{estimateInfo?.estimate_etc}</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>순번</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>브랜드 및 상품코드</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>품명 및 규격</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>수량</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>단위</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>표준단가</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>단가</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>금액</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>표준납기</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}>비고</th>
            </tr>
          </thead>
          <tbody>
            {estimateData?.map((item, index) =>
              <tr key={index}>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>{index + 1}</td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>{item.product_brand}</span><br />
                  <span>{item.product_id}</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>{item.product_title}</span><br />
                  <span>{item.product_spec}</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>{item.estimate_cnt}</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>EA</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>{parseInt(item.product_price).toLocaleString('ko-kr')}</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  {parseInt(parseInt(item.estimate_price) + profit(item)).toLocaleString('ko-KR')}
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  {parseInt((parseInt(item.estimate_price) + profit(item)) * item.estimate_cnt).toLocaleString('ko-KR')}
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}> 
                  <span>{estimateInfo?.estimate_due}일</span>
                </td>
                <td style={{backgroundColor: 'white', border: '1px solid black'}}>
                  <span>{item.product_etc && item.product_etc}</span>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{height: '2em'}}>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={3}>견적금액</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={5}>
                <span>{parseInt(totalAmount).toLocaleString()}</span>
              </th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}></th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}></th>
            </tr>
            <tr style={{height: '2em'}}>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={3}>총할인금액</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={5}>
                <span>{parseInt(totalDiscount).toLocaleString()}</span>
              </th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}></th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}></th>
            </tr>
            <tr style={{height: '2em'}}>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={3}>최종금액</th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} colSpan={5}>
                <span>{parseInt(totalAmount - totalDiscount).toLocaleString()}</span>
              </th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}} ></th>
              <th style={{backgroundColor: 'white', border: '1px solid black'}}></th>
            </tr>
          </tfoot>
        </table>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1em', paddingBottom: '1em', paddingRight: '1em', borderBottom: '1px solid black'}}>
          <span>마지막페이지 입니다.</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1em', paddingBottom: '1em', paddingRight: '1em', borderBottom: '1px solid black'}}>
          <span>견적 유효기간 : {new Date(estimateInfo?.estimate_expire).toLocaleDateString()}</span>
        </div>
        <div style={{padding: '1em'}}>
          주의 : 
          <p className={styles.bodyInfo}>1. 견적유효기간내 제조사 사정, 환율변동 등으로 가격 변동이 있을 수 있음.<br/>
                2. 견적서와 상이한 수량 또는 제품 주문 시 가격 변동될 수 있음.<br/>
                3. 표준납기일은 재고가 없을 경우 예상 납기일이며 재고유무는 성동물산에서 확인 바랍니다.
          </p>
        </div>
      </div>
      <footer style={{position: 'fixed', bottom: 0}}>
        <div>
          <span>견적번호 : {estimateInfo?.estimate_id}</span>
        </div>
      </footer>
    </section>
  )
});

export default EstimatePrint;