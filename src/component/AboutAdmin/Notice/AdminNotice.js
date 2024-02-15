import { useState, useEffect } from "react";
import styles from "./AdminNotice.module.css";
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import EditModal from "./EditModal";
import { useListActions, useNoticePostList, useModalActions, useModalState, useNoticeActions, useNotice } from "../../../store/DataStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WriteModal from "./WriteModal";
import axios from "axios";
import { GetCookie } from "../../../customFn/GetCookie";

export default function AdminNotice() {
  const { isModal, modalName } = useModalState();
  const { closeModal, selectedModalOpen } = useModalActions();

  const { isLoading, isError, data: noticePostList } = useQuery({ queryKey: ['notice'] });

  const { addNoticeData, resetNoticeData } = useNoticeActions();
  const notice = useNotice();

  //게시글 삭제 함수
  const fetchDeletedData = async (item) => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.delete("/notice/delete",
        JSON.stringify(item),
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
      throw new Error('게시글을 삭제하던 중 오류가 발생했습니다.');
    }
  };

  const { deletePostMutation } = useMutation({
    mutationFn: fetchDeletedData,
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

  function handleConfirmSD() {
    // 입력 조건 부여
    const isCheckInputLength = notice.title.length > 2 && notice.writer.length > 2 && notice.contents.length > 10;

    // 조건에 부합한다면
    if (isCheckInputLength) {
      editPostMutation.mutate();
      // 모달 닫기
      closeModal();
      resetNoticeData();

      alert("등록되었습니다.");

    } else {
      alert("제목을 2글자 이상, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }
  }

  // 데이터 로딩 중 또는 에러 발생 시 처리
  if (isLoading) {
    return ( // isLoading이 true일 때 스켈레톤 이미지 표시 ( 20개 )
      <div className={styles.skeletonContainer}>
        {/* 15짜리 배열 생성 -> 반복 */}
        {[...Array(15)].map((_, index) => (
          <div key={index} className={styles.skeletonItem}></div>
        ))}
      </div>
    );
  }
  if (isError) {
    return <p>Error fetching data</p>;
  }


  // 글 클릭 시 해당 글 수정할 수 있는 모달 창 생성

  return (
    <>
      <div className={styles.body}>

        {/* 코드발급 | 최신코드 묶음 */}
        <div className={styles.flex_container}>
          {/* 코드 발급 블록 */}
          <div className={styles.left}>
            <div className={styles.left_inner}>
              <div className={styles.writeNotice_icon}>Click <i className="fa-solid fa-arrow-down"></i></div>
              <div className='original_button' onClick={() => { selectedModalOpen('write') }}>글 작성</div>
            </div>
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
            {noticePostList.map((item, index) => (
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
                    onClick={() => deletePostMutation.mutate()
                    }>
                    삭제
                  </button>
                </td>
                {/* 수정 모달 */}
                {isModal && modalName === 'edit' &&
                  <EditModal handleConfirmSD={handleConfirmSD} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 영역 */}
      {
        isModal && modalName === 'write' &&
        <WriteModal addPost={addPost} />
      }
    </ >
  )
}