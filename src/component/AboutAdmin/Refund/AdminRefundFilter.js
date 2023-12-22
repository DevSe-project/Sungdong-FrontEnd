import styles from './AdminRefundFilter.module.css';
export function AdminRefundFilter(){
  const filterList = [
    { label : '조회기간', content : searchTerm()},
    { label : '처리상태', content : refundStatus()},
    { label : '상세조건', content : detailFilter()},
  ]
  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
        </div>
        {filterList.map((item, index) => ( // 필터의 label 값이랑 content 값 출력
        <div className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        {/* 필터 검색 및 초기화 박스 */}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset'/>
        </div>
      </form>
    </div>
  )
}

// 검색 옵션
function searchTerm(){
  return (
    <div style={{display: 'flex', gap: '1em'}}>
      <div className={styles.searchFilterList}>
        <select name='filterDate'>
          <option name='filterDate' value="반품요청일">반품요청일</option>
          <option name='filterDate' value="수거완료일">수거완료일</option>
          <option name='filterDate' value="결제일">결제일</option>
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
// 반품 상태 옵션
function refundStatus(){
  return(
    <div style={{display: 'flex', gap: '0.5em'}}>
      <div>
        <select name="refundState">
        <option name="orderState" type="전체">전체</option>
          <option name="refundState" type="반품요청">반품 요청</option>
          <option name="refundState" type="수거중">수거 중</option>
          <option name="refundState" type="수거완료">수거 완료</option>
          <option name="refundState" type="반품완료">반품 완료</option>
          <option name="orderState" type="반품철회">반품 철회</option>
        </select>
      </div>
    </div>
  )
}
// 상세 조건 옵션
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
      </select>
      <div>
        <input type='text'/>
      </div>
    </div>
  )
}