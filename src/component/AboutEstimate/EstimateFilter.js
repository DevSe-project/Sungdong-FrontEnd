import { useState } from 'react';
import styles from './Filter.module.css'

export function EstimateFilter({handleSearch}){
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

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
      setStart(newStartDate.toISOString().split('T')[0]);
      setEnd(newEndDate.toISOString().split('T')[0]);
    };
  
    const dateList = () => {
      return Array.from({ length: 12 }, (_, index) => (
        <option key={index} value={index}>{index + 1}월</option>
      ));
    };
  
    const handleStartDateChange = (event) => {
      const newStartDate = new Date(event.target.value);
      setStartDate(newStartDate);
      
      setStart("start", newStartDate.toISOString().split('T')[0]); // Update start date in the filter
    };
    
    const handleEndDateChange = (event) => {
      const newEndDate = new Date(event.target.value);
      setEndDate(newEndDate);
      setEnd(newEndDate.toISOString().split('T')[0]); // Update end date in the filter
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
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => handleStartDateChange(e)}
          />
          &nbsp;~&nbsp;
          <input 
            className={styles.input}
            type='date' 
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => handleEndDateChange(e)}
          />
        </div>
      </div>
    )
  }

  const filterList = [
    { label : '견적일자', content : DateFilter()},
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
        <button className={styles.button} onClick={(e)=> {
            e.preventDefault();
            handleSearch(start, end);
            }}>검색</button>
          <button className={styles.button} onClick={()=> {
            window.location.reload();
            }}>초기화</button>
        </div>
      </form>
    </div>
  )
}