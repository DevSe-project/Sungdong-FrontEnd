import styles from '../Filter.module.css'
export function AccountBookFilter(){
  const filterList = [
    { label : '조회일자', content : dateFilter()},
    { label : '출력', content : detailSearch()},
  ]
  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
        </div>
        {filterList.map((item) => (
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

function dateFilter(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <div>
        <input type='date'></input> 
        &nbsp;~&nbsp;
        <input type='date'></input>
      </div>
      <div>
        <button className={styles.button}>1개월</button>
        <button className={styles.button}>2개월</button>
        <button className={styles.button}>3개월</button>
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