import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './Table.module.css';
import { TakeBackListFilter } from './TakeBackListFilter';
import { useState } from 'react';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination';


export function TakeBackList(){
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {fetchGetServer, fetchServer} = useFetch();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data:raeData } = useQuery({queryKey:['rae'], queryFn: ()=> fetchData()});

  //fetch
  const fetchData = async() => {
    const data = await fetchGetServer(`/rae/list`, 1);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  }

  //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/rae/list', pageNumber);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['orderRefund'], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }


  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return(
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 반품조회</h1>
      </div>
      {/* 필터 */}
      <TakeBackListFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>구분</th>
              <th>일자</th>
              <th>품명/브랜드/규격</th>
              <th>사유</th>
              <th>수량</th>
              <th>금액</th>
              <th>진행상태</th>
              <th>처리일</th>
              <th>담당자</th>
              <th>작성자</th>
            </tr>
          </thead>
          <tbody>
            {raeData.map((item, index) =>
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item.rae_type === 0 ? '반품' : '교환'}</td>
              <td>{new Date(item.rae_requestDate).toLocaleDateString()}</td>
              <td>{item.product_title}/{item.product_brand}/{item.product_spec}</td>
              <td>{item.rae_reason}</td>
              <td>{item.rae_product_cnt}</td>
              <td>{parseInt(item.rae_product_amount).toLocaleString()}</td>
              <td>{item.raeState === 1 ? '반품요청'
                : item.raeState === 2 ? '수거중'
                : item.raeState === 3 ? '수거완료'
                : item.raeState === 4 ? '반품완료'
                : item.raeState === 5 && '반품철회'}
              </td>
              <td>{item.rae_checkDate ? new Date(item.rae_checkDate).toLocaleDateString() : "미 처리"}</td>
              <td>{item.rae_manager ? item.rae_manager : '미 배정'}</td>
              <td>{item.rae_writter}</td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}