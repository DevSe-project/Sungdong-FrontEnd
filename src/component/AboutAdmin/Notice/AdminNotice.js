import { useState, useEffect } from "react";
import styles from "./AdminNotice.module.css";
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import WrtieModal from "./WriteModal";
import EditModal from "./EditModal";
import { NoticePostObj } from "../../Data/NoticePostObj"; // 수정된 부분
import { useListActions, useNoticePostList, useModalActions, useModalState } from "../../../Store/DataStore";

export default function AdminNotice() {
  const noticePostList = useNoticePostList();
  const { setNoticePostList } = useListActions();
  const { isModal, selectedIndex, modalName } = useModalState();
  const { setSelectedIndex, closeModal, selectedModalOpen, selectedModalClose } = useModalActions();
  const [isLoading, setIsLoading] = useState(true); // 로딩 중 여부 추가

  // 데이터 불러오기
  useEffect(() => {
    const dataload = setTimeout(() => {
      setNoticePostList(NoticePostObj);
      setIsLoading(false);
    }, 1000)

    return () => clearTimeout(dataload)
  }, []);

  /* 추후 - 파일 업로드 로직
  const [selectedFile, setSelectedFile] = useState(null); // 파일 업로드 state

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
  };

  const handleUpload = () => {
      if (selectedFile) {
          // 파일 업로드 로직을 구현합니다.
          // 여기에서 서버로 파일을 업로드하거나 다른 작업을 수행할 수 있습니다.
          // 선택한 파일은 selectedFile 변수에 있습니다.
          // 예를 들어, axios를 사용하여 서버로 파일을 업로드하는 방법:
          // const formData = new FormData();
          // formData.append('file', selectedFile);
          // axios.post('/upload', formData)
          //   .then(response => {
          //     // 파일 업로드 성공 시 처리
          //   })
          //   .catch(error => {
          //     // 업로드 실패 시 처리
          //   });
      }
  };
  */

  // 현재 시간을 얻기 위해 Date 객체 생성
  const currentDate = new Date();
  // 현재 날짜 및 시간 정보 얻기
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  // 글 담기
  const [tempList, setTempList] = useState({
    id: '',
    title: '',
    contents: '',
    writer: '', // 관리자 로그인 계정의 이름으로 자동 들어가도록
    date: '',
    files: '',
  })

  const addPost = () => {
    // 입력 값들을 자체 할당
    const { title, writer, contents, files } = tempList;
    // 입력 조건 부여
    const isCheckInputLength = title.length > 2 && writer.length > 2 && contents.length > 10;

    // 조건에 부합한다면
    if (isCheckInputLength) {
      const newPost = {
        id: `${currentYear}#${currentMonth}@${currentDay}*${currentHour}=${currentMinute}`,
        title,
        contents,
        writer,
        date: `${currentYear}/${currentMonth}/${currentDay} ${currentHour}:${currentMinute}`,
        files,
      };


      // 입력받은 정보 추가
      setNoticePostList((prevData) => [...prevData, newPost]);
      // 입력란 초기화
      setTempList({
        id: '',
        title: '',
        contents: '',
        writer: '',
        date: '',
        files: '',
      });

      console.log(noticePostList);
      // 모달 닫기
      closeModal();

      alert("등록되었습니다.");

    } else {
      alert("제목을 2글자 이상, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }
  };


  // 공지사항 리스트 업데이트
  const editNotice = (index, editData) => {
    // 현재 공지사항 리스트 복제
    const editedList = [...noticePostList];
    // 업데이트할 해당 공지사항에 새로운 데이터 할당
    editedList[index] = editData;
    // 부모 컴포넌트에 업데이트된 리스트 전달
    setNoticePostList(editedList);
    setSelectedIndex(null);
    selectedModalClose();
  };


  // 글 클릭 시 해당 글 수정할 수 있는 모달 창 생성

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>

        {/* 사이드바 */}
        <div className={styles.sidebar}>
          <AdminMenuData />
        </div>


        {/* 메인 */}
        <div className={styles.main}>
          {/* 코드발급 | 최신코드 묶음 */}
          <div className={styles.flex_container}>
            {/* 코드 발급 블록 */}
            <div className={styles.left}>
              <div className={styles.left_inner}>
                <div className={styles.writeNotice_icon}>Click <i className="fa-solid fa-arrow-down"></i></div>
                <div className={styles.write} onClick={() => { selectedModalOpen('write') }}>글 작성</div>
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


          {/* Post List */}
          <div className={styles.post_container}>

            {/* Post Title */}
            <div className={styles.post_title}>글 목록</div>

            {/* Post Map */}
            {isLoading
              ?
              ( // isLoading이 true일 때 스켈레톤 이미지 표시 ( 20개 )
                <div className={styles.skeletonContainer}>
                  {/* 15짜리 배열 생성 -> 반복 */}
                  {[...Array(15)].map((_, index) => (
                    <div key={index} className={styles.skeletonItem}></div>
                  ))}
                </div>

              )
              :
              (
                noticePostList.map((item, index) => (
                  <div className={styles.post_list_container} key={index} onClick={() => {
                    setSelectedIndex(index);
                    selectedModalOpen('edit');
                    console.log(selectedIndex);
                  }}>
                    {/* No */}
                    <div className={styles.post_list_info_no}>
                      {index + 1}
                    </div>

                    {/* Code */}
                    <div className={styles.post_list_info_title}>
                      {item.title}
                    </div>

                    {/* Writer */}
                    <div className={styles.post_list_info_writer}>
                      {item.writer}
                    </div>

                    {/* WritedDate */}
                    <div className={styles.post_list_info_date}>
                      {item.date}
                    </div>

                    {/* Del */}
                    <div div className={styles.post_del_container} >
                      <div className={styles.post_del_button}
                        onClick={() => {
                          const data = [...noticePostList];
                          data.splice(index, 1);
                          setNoticePostList(data);
                        }
                        }>
                        삭제
                      </div>
                    </div>
                  </div>
                ))
              )}


          </div>
        </div>
      </div>


      {/* 모달 영역 */}
      {
        isModal && modalName === 'write' ?
          <WrtieModal tempList={tempList} setTempList={setTempList} addPost={addPost} />
          :
          isModal && modalName === 'edit' && selectedIndex != null ?
            <EditModal editNotice={editNotice} list={noticePostList} tempList={tempList} setTempList={setTempList} />
            :
            null
      }


    </div >
  )
}