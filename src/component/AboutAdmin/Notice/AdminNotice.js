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
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호를 담습니다.
  const [itemsPerPage, setItemsPerPage] = useState(10); // 아아템 포스팅 개수
  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state


  const { isModal, modalName, selectedIndex } = useModalState();
  const { closeModal, selectedModalOpen, setSelectedIndex } = useModalActions();
  const { addNoticeData, resetNoticeData } = useNoticeActions();
  const { fetchNonPageServer } = useFetch();
  const notice = useNotice();
  const queryClient = useQueryClient();

  /**
   * 포스트 생성 Fetch 
   * @param {*} newPostData : 새로운 포스팅 데이터 객체를 파라미터로 받습니다.
   * @returns 
   */
  const fetchCreatePost = async (newPostData) => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post(
        "/notice/create",
        newPostData,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('글을 추가하는 중 오류가 발생했습니다.');
    }
  };

  /** 
   * - 설명: 포스트 추가 Function
   * - notice : zustand에 추가할 정보를 담은 객체입니다. 
   */
  const addPost = () => {
    // 입력 조건 부여
    const isCheckInputLength = notice.title.length > 2 && notice.contents.length > 10;

    // 조건에 부합한다면
    if (isCheckInputLength) {
      const newPostData = JSON.stringify(notice);
      createPostMutation(newPostData);
      // 모달 닫기
      closeModal();
      resetNoticeData();

      alert("등록되었습니다.");

    } else {
      alert("제목을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }
  };

  /**
 * @description Mutation을 위한 useMutation 훅을 사용하여 새 글 작성을 요청하는 함수입니다.
 * @param {Object} mutationFn - 새 글 작성을 위한 비동기 함수입니다.
 * @param {Function} onSuccess - 성공 시 실행할 콜백 함수입니다. 데이터가 전달됩니다.
 * @param {Function} onError - 실패 시 실행할 콜백 함수입니다. 에러가 전달됩니다.
 * @example createPostMutation();
 */
  const { mutate: createPostMutation } = useMutation({
    mutationFn: fetchCreatePost,
    onSuccess: (data) => {
      // 성공 시 알림창 표시
      alert(data.message);
      // 콘솔에 성공 메시지 및 데이터 로깅
      console.log('게시글이 업데이트 되었습니다.', data);
      window.location.reload();
    },
    onError: (error) => {
      // 실패 시, 에러 처리를 콘솔에 출력합니다.
      alert(error.message);
      console.error('상태를 변경하던 중 오류가 발생했습니다.', error);
    },
  });





  /**
   * 서버에 Posts 조회 요청을 보냅니다.
   * @param currentPage 현재 페이지
   * @param itemsPerPage 페이지당 포스팅 개수
   * @returns 
   */
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
  /**
   * Middleware. useEffect를 통해 fetchNoticeData()를 실행.
   * @param 
   */
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
   * 서버에 업데이트 요청을 보냅니다.
   * fetchNonPageServer를 사용하여 리팩토링해야 할 소요 있음.
   * @param postId
   * @param title
   * @param writer
   * @param contents
   * @returns 업데이트된 객체
   */
  const fetchUpdatePost = async (updatedData) => {
    // const response = await axios.put(`/notice/update/${postId}`, JSON.stringify(updatedData));
    // return response.data;
    console.log(updatedData);
    const data = fetchNonPageServer(updatedData, `put`, `/notice/update`);
    return data;
  }

  const { mutate: updatePostMutation } = useMutation({ mutationFn: fetchUpdatePost })

  const handleUpdate = async (updatedData) => {
    try {
      // -----유효성 검사-----
      if (updatedData.post_title.length < 2) return alert('제목을 2글자 이상 입력하십시오.');
      if (updatedData.post_content.length < 10) return alert('내용을 10글자 이상 입력하십시오.');
      if (!updatedData.post_writer.length) return alert('작성자란이 비었습니다.');
      // -----변경사항 반영 전 확인-----
      const confirmed = window.confirm('변경사항을 적용하시겠습니까?');
      if (!confirmed) return;
      // -----Mutation 전달-----
      updatePostMutation(updatedData, {
        onSuccess: (success) => {
          alert(success.message);
          window.location.reload();
        },
        onError: (error) => {
          return console.error(error.message);
        }
      })
      // -----에러 잡이 ! -----
    } catch (error) {
      alert('업데이트에 실패하였습니다');
    }
  }

  /**
   * - 게시글 삭제 요청
   * - Server: req.body.postId로 해당 post를 삭제
   * @param postId
  */
  const fetchDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`/notice/delete/${postId}`)
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
      const confirmed = window.confirm('선택된 게시물을 정말 삭제하시겠습니까?');
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
          <tr>
            <th>고유번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {
            matchedData?.map((item, index) => (
              <tr key={index}>
                {/* 글 고유번호 */}
                <td>{index + 1}</td>
                {/* 제목 */}
                <td onClick={() => {
                  selectedModalOpen('edit');
                  setSelectedIndex(index);
                  addNoticeData(item);
                }}>{item.post_title}</td>
                {/* 작성자 */}
                <td>{item.post_writer}</td>
                {/* 날짜 */}
                <td>{item.formatted_date}</td>
                {/* 삭제 */}
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className='white_button'
                    onClick={() => handleDelete(item.postId)}>
                    삭제
                  </button>
                </td>
                {/* 수정 모달 */}
                {/* item을 보내고 EditModal측에서 fetch요청을 통해 item.postId와 동일한 post의 정보를 불러들이도록 */}
                {isModal && modalName === 'edit' && index === selectedIndex &&
                  <EditModal handleUpdate={handleUpdate} item={item} />}
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