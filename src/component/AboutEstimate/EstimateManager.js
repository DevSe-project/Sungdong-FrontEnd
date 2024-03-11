import { useEffect, useRef, useState } from 'react';
import { EstimateFilter } from './EstimateFilter';
import styles from './Table.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetCookie } from '../../customFn/GetCookie';
import { useFetch } from '../../customFn/useFetch';
import { useEstimateActions, useEstimateInfo, useEstimateProduct } from '../../store/DataStore';
import { useReactToPrint } from 'react-to-print';
import EstimatePrint from './EstimatePrint';
import axios from '../../axios';
import Pagination from '../../customFn/Pagination';

export function EstimateManager(){
  const estimateInfo = useEstimateInfo();
  const estimateProduct = useEstimateProduct();
  const { fetchServer,fetchGetServer,handleNoAlertOtherErrors, handleForbiddenError, handleOtherErrors } = useFetch();
  const { resetEstimateProduct, resetEstimateInfo, setEstimateInfo, setEstimateProduct } = useEstimateActions();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      resetEstimateProduct();
      resetEstimateInfo();
      // 컴포넌트가 언마운트될 때 Product 상태 리셋
    };
  }, []);


  //fetch -- 유저
  const fetchUserData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get("/auth/info",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data.data || {};
    } catch (error) {
      // 서버 응답이 실패인 경우
      if (error.response && error.response.status === 401) {
        // 서버가 401 UnAuthorazation를 반환한 경우
        handleNoAlertOtherErrors(error.response.data.message);
        return new Error(error.response.data.message);
      } else if (error.response && error.response.status === 403) {
        handleForbiddenError(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        handleOtherErrors(error.response.data.message);
        throw new Error(error.response.data.message);
      }
    }
  }

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData
  });

  //-------------------------------------------------------------

  //fetch
  const fetchData = async() => {
    const data = await fetchGetServer(`/estimate/manager`, 1);
    return data.data;
  }

  const { isLoading, isError, error, data:estimateListData } = useQuery({queryKey:['estimateManager'], queryFn: ()=> fetchData()});

  const ref = useRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  useEffect(() => {
    if (estimateProduct.length > 0 && estimateInfo) {
      handlePrint();
    }
  }, [estimateInfo, estimateProduct, handlePrint]);

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

    //-------------------------페이지 설정------------------------------

  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/estimate/manager', pageNumber);
  };


  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['estimateManager'], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  //--------------------------------------------------------------------

  /*---------- 필터 검색 ----------*/
  
  /**
   * @필터 POST FETCH 
   * - 필터 검색 Mutation (react-query :: Mutation Hook) 사용
   * @param {*} filter 객체 정보
   * - {start: '', end: ''} - 시작 날짜와 끝 날짜 필터
   */
  const fetchFilteredRae = async (filter) => {
    return await fetchServer(filter, `post`, `/estimate/filter`, 1);
  };

  const { mutate: filterMutation } = useMutation({ mutationFn: fetchFilteredRae })

  /**
   * @검색 Mutation 선언부

   * @returns 필터된 상품의 데이터 객체 (@불러오기 returns 데이터 정보 참조)
   */
  const handleSearch = (start, end) => {

    // 검색 버튼 클릭 시에만 서버에 요청
    const objFilter = {
      start: start,
      end: end
    }
    filterMutation(objFilter, {
      onSuccess: (data) => {
        alert(data.message)
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['estimateManager'], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })  };


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
        <EstimateFilter handleSearch={handleSearch}/>
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
              <td>{`${JSON.parse('[' + item.products + ']')[0]?.product_title} ${JSON.parse('['+item.products+']').length-1 !== 0 ? `외 ${JSON.parse('['+item.products+']').length-1}건` : ""}`}</td>
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
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

    <div style={{display: 'none'}}>
      <EstimatePrint ref={ref}  manager_tel={userData?.tel}/>
    </div>
  </div>
  )
}