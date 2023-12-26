import { useState } from 'react';
import styles from './Filter.module.css'
import { addMonths, subMonths, format } from 'date-fns';

export function ErrorTradeFilter(){
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addMonths(startDate, 1));
  
  function DateFilter(){
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
        <select onChange={(e)=>handleMonthChange(e)}>
          {dateList()}
        </select>
        <div>
          <input 
          className={styles.button}
          type='date' 
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e)=>handleStartDateChange(e)}
          />
          &nbsp;~&nbsp;
          <input 
          className={styles.button}
          type='date' 
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e)=>handleEndDateChange(e)}
          />
        </div>
      </div>
    )
  }

  const filterList = [
    { label : '조회일자', content : DateFilter()},
    { label : '출력', content : detailSearch()},
  ]
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
          <input className={styles.button} type='reset'/>
        </div>
      </form>
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