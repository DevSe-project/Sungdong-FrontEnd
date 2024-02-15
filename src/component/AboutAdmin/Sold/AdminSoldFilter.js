
import { useEffect, useState } from 'react';
import { useOrderFilter, useOrderFilterActions } from '../../../store/DataStore';
import styles from './AdminSoldFilter.module.css';
export function AdminSoldFilter({ handelSearch }) {

  const orderFilter = useOrderFilter();
  const { setOrderFilter, resetOrderFilter, setOrderDetailFilter, setOrderFilterDate } = useOrderFilterActions();
  const [detailKey, setDetailKey] = useState('');


  useEffect(() => {
    return () => {
      resetOrderFilter();
      // 컴포넌트가 언마운트될 때 order 필터 상태 리셋
    };
  }, []);

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

  function detailFilter() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <select className={styles.select} value={detailKey} onChange={(e) => setDetailKey(e.target.value)} name='detailSearch'>
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
          <input className={styles.input} type='text' value={orderFilter.detailFilter[detailKey]} onChange={(e) => setOrderDetailFilter(detailKey, e.target.value)} />
        </div>
      </div>
    )
  }


  function searchTerm() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <div className={styles.searchFilterList}>
          <select className={styles.select} name='filterDate' value={orderFilter.deliveryType} onChange={(e) => setOrderFilter("deliveryType", e.target.value)} >
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
        <div style={{ display: 'flex', gap: '0.5em' }}>
          <input className={styles.button} type='submit' value='검색' onClick={() => handelSearch()} />
          <input className={styles.button} type='reset' onClick={() => resetOrderFilter()} />
        </div>
      </form>
    </div>
  )
}
