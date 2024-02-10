import { useState } from 'react';
import { EstimateFilter } from './EstimateFilter';
import styles from './Table.module.css';
import { useQuery } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useFetch } from '../../customFn/useFetch';

export function EstimateManager(){
  const {fetchGetServer} = useFetch();
  //fetch
  const fetchData = async() => {
    const data = await fetchGetServer(`/estimate/manager`, 1);
    return data.data;
  }
  const { isLoading, isError, error, data:estimateListData } = useQuery({queryKey:['estimateManager'], queryFn: ()=> fetchData()});
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return(
  <div>
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 견적관리</h1>
      </div>
      {/* 필터 */}
        <EstimateFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>순번</th>
              <th>견적번호</th>
              <th>견적일자</th>
              <th>품명 및 규격</th>
              <th>수량</th>
              <th>단위</th>
              <th>금액</th>
              <th>주문하기</th>
              <th>견적서 엑셀</th>
              <th>작성자</th>
              <th><button className={styles.button}>선택 삭제</button></th>
            </tr>
          </thead>
          <tbody>
          {estimateListData.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.estimate_id}</td>
              <td>일자</td>
              <td>품명 및 규격</td>
              <td>수량</td>
              <td>EA</td>
              <td></td>
              <td>주문하기</td>
              <td>견적서 엑셀</td>
              <td>작성자</td>
              <td><input type='checkbox'></input></td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}