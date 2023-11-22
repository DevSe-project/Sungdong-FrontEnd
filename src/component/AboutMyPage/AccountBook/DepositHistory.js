import styles from '../Table.module.css';
import { DepositHistoryFilter } from './DepositHistoryFilter';
export function DepositHistory(){
  return(
    <div>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 입금내역 조회</h1>
      </div>
      {/* 필터 */}
      <DepositHistoryFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>일자</th>
              <th>입금유형</th>
              <th>증빙</th>
              <th>적요</th>
              <th>입금액</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>date</td>
              <td>입금유형</td>
              <td>증빙</td>
              <td>적요</td>
              <td>입금액</td>
              <td>비고내역</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}