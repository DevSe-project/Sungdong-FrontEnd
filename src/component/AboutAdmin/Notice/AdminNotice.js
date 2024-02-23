import styles from "./AdminNotice.module.css";
import EditModal from "./EditModal";
import { useState, useEffect } from "react";
import { useModalActions, useModalState, useNoticeActions, useNotice } from "../../../store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WriteModal from "./WriteModal";
import axios from '../../../axios';
import { GetCookie } from "../../../customFn/GetCookie";
import { useFetch } from "../../../customFn/useFetch";

export default function AdminNotice() {
  const { isModal, modalName } = useModalState();
  const { closeModal, selectedModalOpen } = useModalActions();
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 담습니다.
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state

  const { addNoticeData, resetNoticeData } = useNoticeActions();
  const notice = useNotice();
  const queryClient = useQueryClient();
  const { fetchGetServer } = useFetch();

  const fetchNoticeData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.get(`/notice/read`, {
        params: {
          page: currentPage,
          pagePosts: itemsPerPage
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      return response.data.data.data;
    } catch (error) {
      throw new Error('공지사항 정보를 불러오는 중 오류가 발생하였습니다.');
    }
  }
  const fetchData = async () => {
    try {
      const data = await fetchNoticeData();
      setMatchedData(data);
    } catch (error) {
      throw new Error('데이터를 볼러오는 데 실패했습니다.', error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  /**
   * 게시글 삭제 함수
   * fetchDeletePost: Post삭제 요청을 서버로 보낸다.
   * postId를 매개변수로 받는다.
   * 서버에서는 해당 req.body.postId로 해당 post를 삭제한다.
  */
  const fetchDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`/auth/userDelete/${postId}`,)
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  /**
   * 실제 삭제 버튼에서 사용되는 이벤트 핸들러
   * @param {*} PostId 
   * @returns 
   */
  const handleDelete = async (postId) => {
    try {
      const confirmed = window.confirm('선택된 고객을 정말 삭제하시겠습니까?');
      if (!confirmed) return;

      await deleteMutation(postId);
    } catch (error) {
      handleDeleteError(error);
    }
  };
  const handleDeleteSuccess = (data) => { // 성공 시
    console.log('Post Delete successfully:', data);
    alert(data.message);
    queryClient.invalidateQueries(['notice']);
    window.location.reload();
  };
  const handleDeleteError = (error) => { // 실패 시
    console.error('Post Delete failed:', error);
    alert(error.message);
  };
  const { mutate: deleteMutation } = useMutation({ // Mutation
    mutationFn: fetchDeletePost,
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
  });

  /**
   * 새 글 생성을 위한 서버 요청
   * route : /notice/create 
   * body : dataStore의 notice 객체
   * return : response.data
   */
  const fetchCreatePost = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/notice/create",
        JSON.stringify(
          notice
        ),
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  }
  const { createPostMutation } = useMutation({
    mutationFn: fetchCreatePost,
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('게시글이 업데이트 되었습니다.', data);
      // 상태를 다시 불러와 갱신합니다.
      useQueryClient.invalidateQueries(['notice']);
    },
    onError: (error) => {
      // 실패 시, 에러 처리를 수행합니다.
      console.error('상태를 변경하던 중 오류가 발생했습니다.', error);
    },
  })
  const addPost = () => {
    // 입력 조건 부여
    const isCheckInputLength = notice.title.length > 2 && notice.writer.length > 2 && notice.contents.length > 10;

    // 조건에 부합한다면
    if (isCheckInputLength) {
      createPostMutation.mutate();
      // 모달 닫기
      closeModal();
      resetNoticeData();

      alert("등록되었습니다.");

    } else {
      alert("제목을 2글자 이상, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }
  };

  const fetchUpdatePost = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.put("/notice/edit",
        JSON.stringify(
          notice
        ),
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  }
  const { editPostMutation } = useMutation({
    mutationFn: fetchUpdatePost,
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('게시글이 업데이트 되었습니다.', data);
      // 상태를 다시 불러와 갱신합니다.
      useQueryClient.invalidateQueries(['notice']);
    },
    onError: (error) => {
      // 실패 시, 에러 처리를 수행합니다.
      console.error('상태를 변경하던 중 오류가 발생했습니다.', error);
    },
  })

  const handleConfirmSD = () => {
    const isCheckInputLength = notice.title.length > 2 && notice.writer.length > 2 && notice.contents.length > 10;

    if (isCheckInputLength) {
      const updatedPost = {
        postId: notice.postId, // 고유번호 추가
        title: notice.title,
        writer: notice.writer,
        contents: notice.contents
      };
      editPostMutation.mutate(updatedPost);
      closeModal();
      resetNoticeData();
      alert("등록되었습니다.");
    } else {
      alert("제목을 2글자 이상, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }
  }

  return (
    <div className={styles.body}>

      {/* 코드발급 | 최신코드 묶음 */}
      <div className={styles.flex_container}>
        {/* 코드 발급 블록 */}
        <div className={styles.left}>
          <div className={styles.writeNotice_icon}>Click <i className="fa-solid fa-arrow-down"></i></div>
          <div className='original_button' onClick={() => { selectedModalOpen('write') }}>글 작성</div>
        </div>
        {/* 뭐 넣을지 미정 */}
        <div className={styles.right}>
          <div className={styles.none_title}>
            Custom Title
          </div>
          <div className={styles.none_contents}>
            Custom Contents
          </div>
        </div>
      </div>


      {/* 공시사항 목록 */}
      <table className={styles.noticePostList}>
        <thead
          style={{
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
          <th>고유번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일자</th>
          <th>삭제</th>
        </thead>
        <tbody>
          {
            matchedData?.map((item, index) => (
              <tr key={index}>
                {/* 글 고유번호 */}
                <td>{item.id}</td>
                {/* 제목 */}
                <td onClick={() => {
                  selectedModalOpen('edit');
                  addNoticeData(item);
                }}>{item.title}</td>
                {/* 작성자 */}
                <td>{item.writer}</td>
                {/* 날짜 */}
                <td>{item.date}</td>
                {/* 삭제 */}
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className='white_button'
                    onClick={() => handleDelete(item.id)}>
                    삭제
                  </button>
                </td>
                {/* 수정 모달 */}
                {isModal && modalName === 'edit' &&
                  <EditModal handleConfirmSD={handleConfirmSD} />}
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* 모달 영역 */}
      {
        isModal && modalName === 'write' &&
        <WriteModal addPost={addPost} />
      }
    </div>
  )
}