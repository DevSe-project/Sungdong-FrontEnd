import axios from 'axios';
import styles from './Table.module.css';
import { GetCookie } from '../../customFn/GetCookie';
export function EstimateBox(){
  //fetch
  const fetchData = async() => {
    try{
      const token = GetCookie('jwt_token');
      const response = await axios.get("/estimate/box", 
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
  //const { isLoading, isError, error, data:estiData } = useQuery({queryKey:['estimateBox'], queryFn: ()=> fetchData();});
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
              <td><input type='checkbox'></input></td>
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
      <div className={styles.buttonContainer}>
        <button className={styles.pageButton}>견적하기</button>
        <button className={styles.pageButton}>삭제</button>
      </div>
    </div>
  )
}