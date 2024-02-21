import { useEffect, useState } from 'react';
import styles from './Filter.module.css'
import { addMonths, subMonths, format } from 'date-fns';
import { useTakeBackActions, useTakeBackFilter } from '../../store/DataStore';

export function TackBackFilter(){
  const takeBackFilter = useTakeBackFilter();
  const {setTakeBackFilterOption, resetFilterOption} = useTakeBackActions();

  const filterList = [
    { label : '상품검색', content : searchWord()},
    { label : '조회일자', content : DateFilter()},
    { label : '출력', content : detailSearch()},
  ];

  function searchWord() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품명을 입력해주세요' value={takeBackFilter.product_title} onChange={(e) => setTakeBackFilterOption('product_title', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='브랜드명을 입력해주세요' value={takeBackFilter.product_brand} onChange={(e) => setTakeBackFilterOption('product_brand', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품번호를 입력해주세요' value={takeBackFilter.product_id} onChange={(e) => setTakeBackFilterOption('product_id', e.target.value)} />
        </div>
      </div>
    )
  }


function DateFilter(){
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addMonths(startDate, 1));
  const handleMonthChange = (event) => {
    setStartDate(new Date(2023,event.target.value,1));
    setEndDate(new Date(2023,event.target.value,31));
  };

  const dateList = () => {
    return Array.from({ length: 12 }, (_, index) => (
      <option key={index} value={index}>{index + 1}월</option>
    ));
  };

  const handleStartDateChange = (event) => {
    const newStartDate = new Date(event.target.value);
    setStartDate(newStartDate);
  };
  
  const handleEndDateChange = (event) => {
    const newStartDate = new Date(event.target.value);
    setEndDate(newStartDate);
  };
  return(
    <div style={{ display: 'flex', gap: '1em' }}>
      <select className={styles.select} onChange={(e)=>handleMonthChange(e)}>
        {dateList()}
      </select>
      <div>
        <input 
        className={styles.input}
        type='date' 
        value={format(startDate, 'yyyy-MM-dd')}
        onChange={(e)=>handleStartDateChange(e)}
        />
        &nbsp;~&nbsp;
        <input 
        className={styles.input}
        type='date' 
        value={format(endDate, 'yyyy-MM-dd')}
        onChange={(e)=>handleEndDateChange(e)}
        />
      </div>
    </div>
  )
}

function detailSearch(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <button className={styles.button}>인쇄</button>
      <button className={styles.button}>액셀</button>
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
          <input className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset' onClick={()=> resetFilterOption()}/>
        </div>
      </form>
    </div>
  )
}
