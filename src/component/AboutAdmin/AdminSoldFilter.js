
import styles from './AdminSoldFilter.module.css';
export function AdminSoldFilter(){
  const filterList = [
    { label : '조회기간', content : searchTerm()},
    { label : '주문상태', content : orderStatus()},
    { label : '배송방법', content : deliveryFilter()},
    { label : '상세조건', content : detailFilter()},
  ]
  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
        </div>
        {filterList.map((item, index) => (
        <div className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset'/>
        </div>
      </form>
    </div>
  )
}

function searchTerm(){
  return (
    <div style={{display: 'flex', gap: '1em'}}>
      <div className={styles.searchFilterList}>
        <select name='filterDate'>
          <option name='filterDate' value="결제일">결제일</option>
          <option name='filterDate' value="발주확인일">발주확인일</option>
          <option name='filterDate' value="발송처리일">발송처리일</option>
        </select>
      </div>
      <div className={styles.searchFilterList}>
        <input type='date'/>
        &nbsp;~&nbsp;
        <input type='date'/>
      </div>
    </div>
  )
}

function orderStatus(){
  return(
    <div style={{display: 'flex', gap: '0.5em'}}>
      <div>
        <select name="orderState">
          <option name="orderState" type="신규주문">신규 주문</option>
          <option name="orderState" type="발주확인">발주 확인</option>
          <option name="orderState" type="배송대기중">발송 완료(배송 대기중)</option>
        </select>
      </div>
    </div>
  )
}

function deliveryFilter(){
  return(
    <div style={{display: 'flex', gap: '0.5em'}}>
      <select name='deliveryFilter'>
        <option name='deliveryFilter' value="전체">전체</option>
        <option name='deliveryFilter' value="성동택배">성동택배</option>
        <option name='deliveryFilter' value="일반택배">일반택배</option>
        <option name='deliveryFilter' value="화물">화물</option>
        <option name='deliveryFilter' value="직접수령">직접수령</option>
      </select>
    </div>
  )
}

function detailFilter(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <select name='detailSearch'>
        <option name="detailSearch" value="전체">전체</option>
        <option name="detailSearch" value="수취인명">수취인명</option>
        <option name="detailSearch" value="구매자명">구매자명</option>
        <option name="detailSearch" value="구매자연락처">구매자연락처</option>
        <option name="detailSearch" value="구매자ID">구매자ID</option>
        <option name="detailSearch" value="주문번호">주문번호</option>
        <option name="detailSearch" value="상품번호">상품번호</option>
        <option name="detailSearch" value="송장번호">송장번호</option>
      </select>
      <div>
        <input type='text'/>
      </div>
    </div>
  )
}