import styles from './Table.module.css';

export function EstimateManager(){
  return(
  <div>
    <div style={{width:'90%'}}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 견적함</h1>
      </div>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순번</th>
              <th>견적번호</th>
              <th>견적일자</th>
              <th>품명 및 규격</th>
              <th>금액</th>
              <th>주문하기</th>
              <th>작성자</th>
              <th><input type='checkbox'></input></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>순번</td>
              <td>번호</td>
              <td>일자</td>
              <td>품명 및 규격</td>
              <td>금액</td>
              <td>주문하기</td>
              <td>작성자</td>
              <td><button className={styles.button}>삭제</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button className={styles.submitButton}>견적하기</button>
      </div>
    </div>
  </div>
  )
}