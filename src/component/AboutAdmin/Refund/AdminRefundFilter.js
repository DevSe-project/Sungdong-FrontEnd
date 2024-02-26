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
            <option name='filterDate' value="rae_checkDate">처리일</option>
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
            <option name="raeState" value={1}>요청</option>
            <option name="raeState" value={2}>수거 중</option>
            <option name="raeState" value={3}>수거 완료</option>
            <option name="raeState" value={4}>완료</option>
            <option name="raeState" value={5}>철회</option>
          </select>
        </div>
      </div>
    )
  }

  function detailFilter(){
    return(
      <div style={{display: 'flex', gap: '1em'}}>
        <select className={styles.select} value={raeFilter.selectFilter} onChange={(e)=>setRaeFilter("selectFilter", e.target.value)} name='detailSearch'>
          <option name="detailSearch" value=''>전체</option>
          <option name="detailSearch" value="corName">기업명</option>
          <option name="detailSearch" value="r.rae_manager">담당자명</option>
          <option name="detailSearch" value="rp.writter">작성자명</option>
          <option name="detailSearch" value="r.rae_id">전표번호</option>
          <option name="detailSearch" value="rp.barcodeStatus">바코드상태</option>
          <option name="detailSearch" value="rp.productStatus">상품상태</option>
          <option name="detailSearch" value="rp.wrapStatus">포장상태</option>
        </select>
        <div>
          <input className={styles.input} type='text' value={raeFilter.filterValue} onChange={(e)=>setRaeFilter("filterValue", e.target.value)} />
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
