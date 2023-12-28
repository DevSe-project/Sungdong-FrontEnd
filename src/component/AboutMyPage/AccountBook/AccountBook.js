import axios from 'axios';
import styles from '../Table.module.css';
import { AccountBookFilter } from './AccountBookFilter';
import { GetCookie } from '../../../customFn/GetCookie';
export function AccountBook(){
    //데이터 fetch 
    const fetchData = async() => {
      try{
        const token = GetCookie('jwt_token');
        const response = await axios.get("/accountBook", 
          {
            headers : {
              "Content-Type" : "application/json",
              'Authorization': `Bearer ${token}`,
            }
          }
        )
        return response.data;
      } catch(error) {
        throw new Error('원장 내역을 불러오던 중 오류가 발생했습니다.');
      }
    }
    //const { isLoading, isError, error, data:abData } = useQuery({queryKey:['accountBook'], queryFn: ()=> fetchData();});
  return(
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 원장조회</h1>
      </div>
      {/* 필터 */}
      <AccountBookFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>명세번호</th>
              <th>일자</th>
              <th>수불구분</th>
              <th>배송구분</th>
              <th>적요</th>
              <th>수량</th>
              <th>매출금액</th>
              <th>입금금액</th>
              <th>명세서</th>
            </tr>
            <tr>
              <th colSpan="2">전월이월</th>
              <th colSpan="6"></th>
              <th>잔여 잔액(숫자값)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>명세번호</td>
              <td>일자</td>
              <td>매출/~</td>
              <td>성동택배/화물/대한통운</td>
              <td>상품명/코드/브랜드/규격</td>
              <td>수량</td>
              <td>매출금액</td>
              <td>입금액</td>
              <td><button className={styles.button}>출력</button></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">월계</th>
              <th colSpan="4"></th>
              <th>판매액(숫자값)</th>
              <th>입금액</th>
              <th>잔액(숫자값)</th>
              <th></th>
            </tr>
            <tr>
              <th colSpan="2">누계</th>
              <th colSpan="4"></th>
              <th>판매액(숫자값)</th>
              <th>입금액</th>
              <th>잔액(숫자값)</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}