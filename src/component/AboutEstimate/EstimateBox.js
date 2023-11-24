import styles from './Table.module.css';
export function EstimateBox(){
  return(
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
              <th>이미지</th>
              <th>코드</th>
              <th>품명 및 규격</th>
              <th>브랜드</th>
              <th>재고</th>
              <th>단가</th>
              <th>수량</th>
              <th>공급가</th>
              <th>단위</th>
              <th><input type='checkbox'></input></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>순번</td>
              <td>이미지</td>
              <td>코드</td>
              <td>품명</td>
              <td>브랜드</td>
              <td>재고</td>
              <td>단가</td>
              <td>수량</td>
              <td>공급가</td>
              <td>EA</td>
              <td><button className={styles.button}>삭제</button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">합계</th>
              <th colSpan="6"></th>
              <th>공급가액</th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div>
        <button className={styles.submitButton}>견적하기</button>
      </div>
    </div>
  )
}