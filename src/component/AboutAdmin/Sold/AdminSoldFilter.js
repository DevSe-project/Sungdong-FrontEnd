
import { useEffect } from 'react';
import { useOrderFilter, useOrderFilterActions } from '../../../store/DataStore';
import styles from './AdminSoldFilter.module.css';
export function AdminSoldFilter({ handleSearch, isCancel }) {

  const orderFilter = useOrderFilter();
  const { setOrderFilter, resetOrderFilter, setOrderFilterDate } = useOrderFilterActions();

  useEffect(() => {
    return () => {
      resetOrderFilter();
      // 컴포넌트가 언마운트될 때 order 필터 상태 리셋
    };
  }, []);


  function typeFilter() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <select className={styles.select} value={orderFilter.orderState} onChange={(e) => setOrderFilter("orderState", e.target.value)} name='deliveryFilter'>
          <option name='orderState' value="">전체</option>
          <option name='orderState' value={5}>취소</option>
          <option name='orderState' value={6}>취소요청</option>
        </select>
      </div>
    )
  }

  function deliveryFilter() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <select className={styles.select} value={orderFilter.deliveryType} onChange={(e) => setOrderFilter("deliveryType", e.target.value)} name='deliveryFilter'>
          <option name='deliveryFilter' value="">전체</option>
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
        <select className={styles.select} value={orderFilter.selectFilter} onChange={(e)=>setOrderFilter("selectFilter", e.target.value)} name='detailSearch'>
          <option name="detailSearch" value=''>전체</option>
          <option name="detailSearch" value="o.buildingName">기업명</option>
          <option name="detailSearch" value="o.order_name">구매자명</option>
          <option name="detailSearch" value="o.order_tel">구매자연락처</option>
          <option name="detailSearch" value="o.email">구매자이메일</option>
          <option name="detailSearch" value="o.order_id">주문번호</option>
          <option name="detailSearch" value="d.delivery_num">송장번호</option>
        </select>
        <div>
          <input className={styles.input} type='text' value={orderFilter.filterValue} onChange={(e)=>setOrderFilter("filterValue", e.target.value)} />
        </div>
      </div>
    )
  }


  function searchTerm() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <div className={styles.searchFilterList}>
          <select className={styles.select} name='filterDate' value={orderFilter.dateType} onChange={(e) => setOrderFilter("dateType", e.target.value)} >
            <option name='filterDate' value="orderDate">결제일</option>
          </select>
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='date' value={orderFilter.date.start} onChange={(e) => setOrderFilterDate("start", e.target.value)} />
          &nbsp;~&nbsp;
          <input className={styles.input} type='date' value={orderFilter.date.end} onChange={(e) => setOrderFilterDate("end", e.target.value)} />
        </div>
      </div>
    )
  }

  const filterList = [
    (isCancel ? { label: '주문상태', content: typeFilter()} : {}),
    { label: '조회기간', content: searchTerm() },
    { label: '배송방법', content: deliveryFilter() },
    { label: '상세조건', content: detailFilter() },
  ]
  return (
    <div style={{ width: '100%' }}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray' }}>
          <h4 style={{ fontSize: '1.2em', fontWeight: '650' }}>필터</h4>
        </div>
        {filterList.map((item, index) => (
          <div key={index} className={styles.container}>
            <div className={styles.label}>
              {item.label}
            </div>
            <div className={styles.content}>
              {item.content}
            </div>
          </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
        <button className={styles.button} onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            검색  
          </button>
          <button className={styles.button} onClick={() => {
            resetOrderFilter()
            window.location.reload();
            }}>
            초기화
          </button>
        </div>
      </form>
    </div>
  )
}
