import { useEffect, useRef, useState } from 'react';
import { EstimateFilter } from './EstimateFilter';
import styles from './Table.module.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useFetch } from '../../customFn/useFetch';
import { useEstimateActions, useEstimateInfo, useEstimateProduct } from '../../store/DataStore';
import { useReactToPrint } from 'react-to-print';
import EstimatePrint from './EstimatePrint';

export function EstimateManager(){
  const {fetchGetServer} = useFetch();
  const estimateInfo = useEstimateInfo();
  const estimateProduct = useEstimateProduct();
  const { fetchServer } = useFetch();
  const { resetEstimateProduct, resetEstimateInfo, setEstimateInfo, setEstimateProduct } = useEstimateActions();

  useEffect(() => {
    return () => {
      resetEstimateProduct();
      resetEstimateInfo();
      // 컴포넌트가 언마운트될 때 Product 상태 리셋
    };
  }, []);


  //fetch
  const { data: userData } = useQuery({ queryKey: ['user'] })

  //fetch
  const fetchData = async() => {
    const data = await fetchGetServer(`/estimate/manager`, 1);
    return data.data;
  }

  const { isLoading, isError, error, data:estimateListData } = useQuery({queryKey:['estimateManager'], queryFn: ()=> fetchData()});
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  const ref = useRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });


  useEffect(() => {
    if (estimateProduct.length > 0 && estimateInfo) {
      handlePrint();
    }
  }, [estimateInfo, estimateProduct]);

  //견적 프린트 함수
  const addToEstimate = async (info) => {
    return fetchServer(info, `post`, `/estimate/selectPrint`, 1);
  };

  //견적 추가 함수
  const { mutate:addEstimate } = useMutation({mutationFn : addToEstimate});

async function submitEstimate(info) {
      // 견적 리스트업에 저장
        addEstimate(info, {
          onSuccess: (success) => {
            console.log("견적리스트를 업데이트 하였습니다.", success);
            setEstimateProduct(success.data);
            setEstimateInfo(info);
          },
          onError: (error) => {
            console.error('견적리스트 리스트업을 수행하던 중 오류가 발생했습니다.', error);
          },
        });
  }


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
              <th>내용</th>
              <th>공급자</th>
              <th>공급받는 자</th>
              <th>총 견적가</th>
              <th>프린트 출력</th>
            </tr>
          </thead>
          <tbody>
          {estimateListData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.estimate_id}</td>
              <td>{new Date(item.estimate_date).toLocaleString()}</td>
              <td>{`${JSON.parse('[' + item.products + ']')[0]?.product_title} 외 ${JSON.parse('['+item.products+']').length-1}건`}</td>
              <td>{item.estimate_supplier_managerName}</td>
              <td>{item.estimate_vendor_managerName}</td>
              <td>{item.estimate_amount && parseInt(item.estimate_amount).toLocaleString('ko-KR',{ style: 'currency', currency: 'KRW' })}</td>
              <td><button className='original_round_button' onClick={()=> submitEstimate(item)}>출력</button></td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div style={{display: 'none'}}>
      <EstimatePrint ref={ref}  manager_tel={userData.tel}/>
    </div>
  </div>
  )
}