import { TopBanner } from '../TemplateLayout/AboutHeader/TopBanner'
import image from '../.././image/page_ready.png'
import styles from './Event.module.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useFetch } from '../../customFn/useFetch';
import Pagination from '../../customFn/Pagination';
export function Event(){

  const queryClient = useQueryClient();

  //Fetch Custom Hooks
  const { fetchServer, fetchGetServer } = useFetch();

  //현재 페이지와 전체 페이지 개수 State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 페이지 개수 지정
   * @returns 전체 이벤트 조회
   * - event_id - 이벤트 고유번호
   * - event_image : 이벤트 이미지
   * - event_content : 이벤트 정보(설명)
   * - event_title : 이벤트 타이틀명
   * - event_startDate : 이벤트 시작일
   * - event_endDate : 이벤트 종료일
   */
    const fetchData = async () => {
      const data = await fetchGetServer("/event/list", 1);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      return data.data;
    };
  
    const {
      isLoading,
      isError,
      error,
      data: eventData,
    } = useQuery({
      queryKey: ["event"],
      queryFn: () => fetchData(),
    });

  /**
   * - Mutation Hook 이용
   *
   * @param {*} pageNumber 변경할 페이지 넘버
   * @returns Fetch Post / 변경할 페이지에 해당하는 상품 데이터 반환
   */
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, "post", "/event/list", pageNumber);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange });

  /**
   * -- 페이지 변경 Mutation 선언 함수
   * - setCurrentPage - 현재 페이지 재 지정
   * - setTotalPages - 전체 페이지 수 재 지정
   * @param {*} pageNumber 변경할 페이지 넘버
   */
  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(["event"], () => {
          return data.data.data;
        });
      },
      onError: (error) => {
        return console.error(error.message);
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
      <main className={styles.head}>
        <div className={styles.title}>
          <h1>진행중인 이벤트</h1>
        </div>
        <div className={styles.body}>
          {eventData?.map((item, index) => 
          <div key={index} className={styles.content}>
            <div className={styles.contentBody}>
              <img src={item.event_image} alt="이미지"/>
              <div className={styles.text}>
                <h1>{item.event_title}</h1>
                <h4>{item.event_content}</h4>
              </div>
            </div>
            <div className={styles.contentFooter}>
              <h4>이벤트 기간 : {new Date(item.event_startDate).toLocaleDateString()} ~ {new Date(item.event_endDate).toLocaleDateString()}</h4>
              <ul style={{display: 'flex', flexDirection: 'column', marginTop: '1em', listStyle: 'circle', gap: '0.5em'}}>
                <li>카카오채널 1:1 문의</li>
                <li>사무실(052-269-1840) 전화문의</li>
              </ul>
            </div>
          </div>
          )}
        </div>
      </main>
      <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  )
}