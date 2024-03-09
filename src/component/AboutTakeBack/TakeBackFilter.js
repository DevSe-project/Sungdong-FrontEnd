import { useEffect, useState } from 'react';
import styles from './Filter.module.css'
import { useTakeBackActions, useTakeBackFilter } from '../../store/DataStore';

export function TackBackFilter({handleSearch}){
  const takeBackFilter = useTakeBackFilter();
  const {setTakeBackFilterOption, resetFilterOption, setTakeBackFilterDate} = useTakeBackActions();

  useEffect(() => {
    return () => {
      resetFilterOption();
      window.location.reload();
    }
  }, [])

  const filterList = [
    { label : '상품검색', content : searchWord()},
    { label : '조회일자', content : DateFilter()},
  ];

  function searchWord() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품명' value={takeBackFilter.product_title} onChange={(e) => setTakeBackFilterOption('product_title', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='브랜드명' value={takeBackFilter.product_brand} onChange={(e) => setTakeBackFilterOption('product_brand', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품번호' value={takeBackFilter.product_id} onChange={(e) => setTakeBackFilterOption('product_id', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='규격' value={takeBackFilter.product_spec} onChange={(e) => setTakeBackFilterOption('product_spec', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='모델명' value={takeBackFilter.product_model} onChange={(e) => setTakeBackFilterOption('product_model', e.target.value)} />
        </div>
      </div>
    )
  }


  function DateFilter() {
    const today = new Date();
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  
    const handleMonthChange = (event) => {
      const month = parseInt(event.target.value);
      const newStartDate = new Date(today.getFullYear(), month, 2);
      const newEndDate = new Date(today.getFullYear(), month + 1, 1);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setTakeBackFilterDate("start", newStartDate.toISOString().split('T')[0]); // Update start date in the filter
      setTakeBackFilterDate("end", newEndDate.toISOString().split('T')[0]); // Update end date in the filter
    };
  
    const dateList = () => {
      return Array.from({ length: 12 }, (_, index) => (
        <option key={index} value={index}>{index + 1}월</option>
      ));
    };
  
    const handleStartDateChange = (event) => {
      const newStartDate = new Date(event.target.value);
      setStartDate(newStartDate);
      setTakeBackFilterDate("start", newStartDate.toISOString().split('T')[0]);
    };
    
    const handleEndDateChange = (event) => {
      const newEndDate = new Date(event.target.value);
      setEndDate(newEndDate);
      setTakeBackFilterDate("end", newEndDate.toISOString().split('T')[0]);
    };
  
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <select className={styles.select} onChange={(e) => handleMonthChange(e)}>
          {dateList()}
        </select>
        <div>
          <input 
            className={styles.input}
            type='date' 
            value={startDate.toISOString().split('T')[0]} // Format the date for input value
            onChange={(e) => handleStartDateChange(e)}
          />
          &nbsp;~&nbsp;
          <input 
            className={styles.input}
            type='date' 
            value={endDate.toISOString().split('T')[0]} // Format the date for input value
            onChange={(e) => handleEndDateChange(e)}
          />
        </div>
      </div>
    )
  }
  

  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
        </div>
        {filterList.map((item, key) => (
        <div key={key} className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <button className={styles.button} onClick={(e)=> {
            e.preventDefault();
            handleSearch(takeBackFilter);
            }}>검색</button>
          <button className={styles.button} onClick={()=> resetFilterOption()}>초기화</button>
        </div>
      </form>
    </div>
  )
}
