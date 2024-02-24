import { useState } from 'react';
import { useRaeFilter, useRaeFilterActions } from '../../../store/DataStore';
import styles from './AdminRefundFilter.module.css';
export function AdminRefundFilter({handleSearch}){
  const raeFilter = useRaeFilter();
  const {setRaeFilter, resetRaeFilter, setRaeDetailFilter, setRaeFilterDate} = useRaeFilterActions();
  const [detailKey, setDetailKey] = useState('');

  function searchTerm(){
    return (
      <div style={{display: 'flex', gap: '1em'}}>
        <div className={styles.searchFilterList}>
          <select className={styles.select} name='filterDate' value={raeFilter.raeDateType} onChange={(e)=>setRaeFilter("raeDateType", e.target.value)} >
            <option name='filterDate' value="rae_requestDate">반품 요청일</option>
            <option name='filterDate' value="rae_checkDate">수거 완료일</option>
          </select>
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='date' value={raeFilter.date.start} onChange={(e)=>setRaeFilterDate("start", e.target.value)} />
          &nbsp;~&nbsp;
          <input className={styles.input} type='date' value={raeFilter.date.end} onChange={(e)=>setRaeFilterDate("end", e.target.value)} />
        </div>
      </div>
    )
  }

  function refundStatus(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <div>
          <select className={styles.select} value={raeFilter.raeState} onChange={(e)=>setRaeFilter("raeState", e.target.value)} name="raeState">
            <option name="raeState" value="">전체</option>
            <option name="raeState" value={1}>반품 요청</option>
            <option name="raeState" value={2}>수거 중</option>
            <option name="raeState" value={3}>수거 완료</option>
            <option name="raeState" value={4}>반품 완료</option>
            <option name="raeState" value={5}>반품 철회</option>
          </select>
        </div>
      </div>
    )
  }

  function detailFilter(){
    return(
      <div style={{display: 'flex', gap: '1em'}}>
        <select className={styles.select} value={detailKey} onChange={(e)=>setDetailKey(e.target.value)} name='detailSearch'>
          <option name="detailSearch" value=''>전체</option>
          <option name="detailSearch" value="companyName">기업명</option>
          <option name="detailSearch" value="name">구매자명</option>
          <option name="detailSearch" value="tel">구매자연락처</option>
          <option name="detailSearch" value="userId">구매자ID</option>
          <option name="detailSearch" value="orderId">주문번호</option>
          <option name="detailSearch" value="productId">상품번호</option>
          <option name="detailSearch" value="deliveryNum">송장번호</option>
        </select>
        <div>
          <input className={styles.input} type='text' value={raeFilter.detailFilter[detailKey]} onChange={(e)=>setRaeDetailFilter(detailKey, e.target.value)} />
        </div>
      </div>
    )
  }


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
        <div className={styles.container} key={index}>
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
          <input className={styles.button} type='submit' value='검색' onClick={()=> handleSearch()}/>
          <input className={styles.button} type='reset' onClick={()=>resetRaeFilter()}/>
        </div>
      </form>
    </div>
  )
}
