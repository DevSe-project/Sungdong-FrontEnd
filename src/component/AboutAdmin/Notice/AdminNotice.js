import { useState, useEffect } from "react";
import styles from "./AdminNotice.module.css";
import { AdminHeader } from "../AdminHeader";
import { AdminMenuData } from "../AdminMenuData";
import WrtieModal from "./WriteModal";
import EditModal from "./EditModal";
import { NoticePostObj } from "../../Data/NoticePostObj"; // 수정된 부분
import { useListActions, useListStore, useNoticePostList } from "../../../Store/DataStore";

export default function AdminNotice() {
  const postList = useNoticePostList();
  const { setPostList } = useListActions();
  const [isLoading, setIsLoading] = useState(true); // 로딩 중 여부 추가

  // 데이터 불러오기
  useEffect(() => {
    const dataload = setTimeout(() => {
      setPostList(NoticePostObj);
      setIsLoading(false);
    }, 1000)

    return () => clearTimeout(dataload)
  }, [setPostList]);

  // State
  const [modal, setModal] = useState(false); // modal on / off
  const [modalName, setModalName] = useState(''); // what is modal?
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // 해당 인덱스의 모달을 찾기 위함

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


  // Enter key를 누를 시, 모달 창 오픈
  const onOpen = (index) => {
    setModal(true);
    setModalName('edit');
    setSelectedItemIndex(index);
  }
  const openWriteModal = () => {
    setModal(true);
    setModalName('write');
  }
  const closeWriteModal = () => {
    setTempList({
      id: '',
      title: '',
      contents: '',
      writer: '',
      date: '',
      file: '',
    });
    setModal(false);
    setModalName('');
  }

  // 글 담기
  const [tempList, setTempList] = useState({
    id: '', // length + 1로 지정할 것
    title: '',
    contents: '',
    writer: '', // 관리자 로그인 계정의 이름으로 자동 들어가도록
    date: '', // 추후에 자동으로 날짜를 받아오는 api 구현
    file: '',
  })

  const addPost = () => {
    const { title, writer, contents } = tempList; // 입력 값들을 자체 할당
    const isCheckInputLength = title.length > 2 && writer.length > 2 && contents.length > 10; // 입력 조건 부여
    // 조건에 부합한다면
    if (isCheckInputLength) {
      const newPost = {
        id: `${currentYear}#${currentMonth}@${currentDay}*${currentHour}=${currentMinute}`,
        title,
        contents,
        writer,
        date: `${currentYear}/${currentMonth}/${currentDay} ${currentHour}시 ${currentMinute}분`,
      };
      // 입력받은 정보 추가
      setPostList((prevListData) => [...prevListData, newPost]);
      alert("등록되었습니다.");
      // 입력란 초기화
      setTempList({
        id: '',
        title: '',
        contents: '',
        writer: '',
        date: '',
        file: '',
      });

      setModal(false);
      setModalName('');
    } else {
      alert("제목을 2글자 이상, 작성자 명을 2글자 이상, 본문 내용을 10글자 이상 작성하십시오.");
    }

  };

  // 공지사항 리스트 업데이트
  const editNotice = (index, editData) => {
    // 현재 공지사항 리스트 복제
    const editedList = [...postList];
    // 업데이트할 해당 공지사항에 새로운 데이터 할당
    editedList[index] = editData;
    // 부모 컴포넌트에 업데이트된 리스트 전달
    setPostList(editedList);
  };


  // 글 클릭 시 해당 글 수정할 수 있는 모달 창 생성

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <div className={styles.mainContents}>
          {/* 코드발급 | 최신코드 묶음 */}
          <div className={styles.evnetHandleContainer}>
            {/* 코드 발급 블록 */}
            <div className={styles.leftModule}>
              <div className={styles.writeNotice_icon}>Click <i className="fa-solid fa-arrow-down"></i></div>
              <div className={styles.write} onClick={() => { openWriteModal() }}>글 작성</div>
            </div>
            {/* 뭐 넣을지 미정 */}
            <div className={styles.rightModule}>
              <div className={styles.none_title}>
                custom title
              </div>
              <div className={styles.none_contents}>
                custom contents
              </div>
            </div>
          </div>
          {/* Post List */}
          <div className={styles.postList_container}>
            {/* Post Title */}
            <div className={styles.postList_container_title}>글 목록</div>
            {/* Post Map */}
            {isLoading ? ( // isLoading이 true일 때 스켈레톤 이미지 표시
              <div className={styles.skeletonContainer}>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
                <div className={styles.skeletonItem}></div>
                {/* 추가적인 스켈레톤 아이템 */}
              </div>
            ) : (
                postList.map((item, index) => (
                  <div className={styles.post_container}>
                    <div className={styles.postInfo_container} onClick={() => { onOpen(index) }} key={index}> {/* 선택 모달의 key를 글 수정으로 지정*/}
                      {/* No */}
                      <div className={styles.post_no}>
                        {index + 1}
                      </div>
                      {/* Code */}
                      <div className={styles.post_title}>
                        {item.title}
                      </div>
                      {/* Writer */}
                      <div className={styles.post_writer}>
                        {item.writer}
                      </div>
                      {/* WritedDate */}
                      <div>
                        {item.date}
                      </div>
                    </div>
                    {/* Del */}
                    <div div className={styles.post_del_container} >
                      <div className={styles.post_delButton}
                        onClick={() => {
                          const data = [...postList];
                          data.splice(index, 1);
                          setPostList(data);
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
      {
        modal && modalName === 'write' ?
          <WrtieModal modalName={modalName} setModalName={setModalName} modal={modal} setModal={setModal} tempList={tempList} setTempList={setTempList} addPost={addPost} closeWriteModal={closeWriteModal} />
          :
          modal && modalName === 'edit' ?
            <EditModal editNotice={editNotice} list={postList} modalName={modalName} setModalName={setModalName} modal={modal} setModal={setModal} tempList={tempList} setTempList={setTempList} selectedItemIndex={selectedItemIndex} setSelectedItemIndex={setSelectedItemIndex} closeWriteModal={closeWriteModal} />
            :
            null
      }


    </div >
  )
}