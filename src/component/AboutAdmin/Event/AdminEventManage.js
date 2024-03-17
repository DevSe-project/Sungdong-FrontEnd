import { useState } from "react";
import { AdminEventFilter } from "../Event/AdminEventFilter";
import React from "react";
import styles from "./AdminEventManage.module.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEventFilter } from "../../../store/DataStore";
import axios from "../../../axios";
import { useFetch } from "../../../customFn/useFetch";
import Pagination from "../../../customFn/Pagination";
export function AdminEventManage() {
  const navigate = useNavigate();

  //상품 필터 Zustand State
  const eventFilter = useEventFilter();

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

  /**
   * - 상품 / 상품 고유번호를 가져와 수정 페이지로 이동하는 함수
   * @param {*} item 상품 데이터 (@불러오기 의 returns 데이터 정보 참조)
   */
  function handleEditItem(id) {
    navigate(`/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/event/edit/${id}`);
  }

  /*---------- 필터 검색 ----------*/

  /**
   * @필터 POST FETCH
   * - 필터 검색 Mutation (react-query :: Mutation Hook) 사용
   * @param {*} filter 객체 정보
   * - date: {start: '', end: ''} - 시작일자와 끝 일자
   * - dateType: "" - 날짜 형식
   * - state: Array(0) - 이벤트 상태
   */
  const fetchFilteredEvents = async (filter) => {
    return await fetchServer(filter, `post`, `/event/filter`, 1);
  };

  const { mutate: filterMutation } = useMutation({
    mutationFn: fetchFilteredEvents,
  });

  /**
   * @검색 Mutation 선언부
   * 조건
   * - 이벤트 상태는 적어도 1개 이상 체크하여야 함!
   * @returns 필터된 상품의 데이터 객체 (@불러오기 returns 데이터 정보 참조)
   */
  const handleSearch = () => {
    if (eventFilter.state.length === 0) {
      alert("이벤트 상태는 적어도 1개 이상은 체크하여야 합니다!");
      return;
    }
    // 검색 버튼 클릭 시에만 서버에 요청
    filterMutation(eventFilter, {
      onSuccess: (data) => {
        alert(data.message);
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
  };

  /**
   * @삭제 DELETE FETCH
   * - deleteEventMutation (react-query :: Mutation Hook) 이용
   * - 파라미터에 이벤트 고유번호를 삽입
   *
   * @param {*} eventId 이벤트 고유번호(item.event_id)
   * @returns
   */
  const fetchDeletedEvents = async (eventId) => {
    try {
      const response = await axios.delete(`/event/delete/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 상품 삭제를 처리하는 뮤테이션
  const { mutate: deleteEventMutation } = useMutation({
    mutationFn: fetchDeletedEvents,
  });

  /**
   * @삭제핸들러 Mutation 선언부
   * - isConfirmed : window.confirm을 이용한 재 확인 절차
   * - 확인 시 파라미터에 item.product_id를 전송하여 삭제 API 요청
   * @param {*} item 삭제 할 상품 데이터(@불러오기 상품 데이터 정보 참고)
   */
  const handleDeleted = (item) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      deleteEventMutation(item.event_id, {
        onSuccess: (data) => {
          alert(data.message);
          // 상품 삭제 성공 시 상품 목록을 다시 불러옴
          queryClient.invalidateQueries(["event"]);
        },
        onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          console.error("상품을 삭제 처리하는 중 오류가 발생했습니다.", error);
        },
      });
    }
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className="LargeHeader">이벤트 조회</div>
        <AdminEventFilter handleSearch={handleSearch} />
        <div className={styles.tableLocation}>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>이미지</th>
                <th>상태</th>
                <th>이벤트 제목</th>
                <th>내용</th>
                <th>이벤트 시작일</th>
                <th>이벤트 종료일</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {eventData.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td>{item.event_id}</td>
                    <td>
                      <img
                        className={styles.thumnail}
                        src={item.event_image}
                        alt="이미지"
                      ></img>
                    </td>
                    <td>
                      {item.eventState === 1
                        ? "준비"
                        : item.eventState === 2
                        ? "진행 중"
                        : item.eventState === 3
                        ? "중단"
                        : item.eventState === 4 && "종료"}
                    </td>
                    <td>{item.event_title}</td>
                    <td>{item.event_content}</td>
                    <td>
                      {new Date(item.event_startDate).toLocaleDateString()}
                    </td>
                    <td>{new Date(item.event_endDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="white_round_button"
                        onClick={() => handleEditItem(item.event_id)}
                      >
                        수정
                      </button>
                    </td>
                    <td>
                      <button
                        className="white_round_button"
                        onClick={() => handleDeleted(item)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className="original_round_button"
            onClick={() =>
              navigate(
                `/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/event/create`
              )
            }
          >
            생성
          </button>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
