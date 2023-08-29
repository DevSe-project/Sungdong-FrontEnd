import { useState } from 'react';
import styles from './QnAWrite.module.css';

export function QnAWrite(props) {

  const [tempInput, setTempInput] = useState([
    {
      title: '',
      content: '',
    },
  ])
  // 제목을 담음
  const handleTitle = (e) => {
    setTempInput((prevInput) => ({
      ...prevInput, title: e.target.value
    }))
  }

  // 내용을 담음
  const handleContent = (e) => {
    setTempInput((prevInput) => ({
      ...prevInput, content: e.target.value
    }))
  }

  // setInput배열에 입력받은 내용을 추가할 함수
  const addInput = () => {
    if(tempInput.title && tempInput.content){
      // 현재 날짜와 시간을 가져오기
      const currentDate =  new Date();
      const formattedDate = currentDate.toLocaleString();

      // 새로운 글 객체 생성
      const newPost = {
        id: props.detailData.qna ? props.detailData.qna.length + 1 : 1, //현재 글 개수를 id로 사용
        userId: 'asdfx100',
        nickName: '노란 곰돌',
        title: tempInput.title,
        content: tempInput.content,
        date: formattedDate,
      };

      const copyData = props.data.map((item) => {
        if (item.id === props.detailData.id) {
          return {
            ...item,
            qna: item.qna ? [...item.qna, newPost] : [newPost], // data - review객체에 새로운 review 객체 추가
          };
        }
        return item;
      });
        props.setData(copyData);


      // 입력란 초기화
      setTempInput({
        title: '',
        content: '',
      })

      // 모달창 닫기
      props.setWriteState(0);
    } else {
      alert("작성되지 않은 란이 있습니다! 확인해주세요!");
    }
  }

  return (
    // 뒷배경 오버레이
    <div className={styles.modalOverlay}>
      {/* 글쓰기모달창 */}
      <div className={styles.modalWindow}>
        {/* X 버튼 */}
        <div className={styles.exit}>
          <span onClick={() => { props.setWriteState(0) }}>
            <i class="fas fa-times"></i>
          </span>
        </div>
        {/* POST : 창 이름 */}
        <div className={styles.post}>Q & A</div>
        {/* 작성컨테이너 */}
        <div className={styles.inputContainer}>
          {/* 제목 */}
          <div className={styles.title}>
            <label className={styles.title_label} for="titleInput">제목</label>
            <input
              className={styles.title_input}
              id='titleInput'
              value={tempInput.title}
              onChange={e => { handleTitle(e) }}
            />
          </div>
          {/* 내용 */}
          <div className={styles.content}>
            <label className={styles.content_label} for="contentInput">내용</label>
            <textarea
              className={styles.content_input}
              id='contentInput'
              value={tempInput.content}
              onChange={e => { handleContent(e) }}
            />
          </div>
        </div>
        {/* 등록 */}
        <div className={styles.addButtonContainer}>
          <div
            className={styles.addButton}
            onClick={addInput}
          >
            등 록
          </div>
        </div>
      </div>
    </div>
  )
}