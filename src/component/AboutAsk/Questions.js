import styles from './Questions.module.css';
import { WritingsObj } from '../Data/WritingsObj';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WriteModal from './WriteModal';


export default function Questions() {
    // 문의하기 글쓰는 창을 나타내기 위한 state
    const [writeState, setWriteState] = useState(0);

    const [writeList, setWriteList] = useState([
        {
            title: '성동물산 왜 이렇게 빨간가요...?',
            content: '성동물산 프로젝트... 아직도 API가 구현을 못하겠다 싯팔 그냥 백앤드도 공부해야겠다는 생각이 든다. 어떤 식으로 하면 좋을까요 성동 씨?',
            date: `2023. 8. 22. 오후 8:23:55`,
            writer: '엄지석',
            viewer: 0,
        },
    ]);

    // 글 list에 글을 넣는 작업


    return (
        <div className={styles.body}>
            {/* 문의글 검색 input */}
            <div className={styles.mainPost}>
                성동물산 고객센터 질문게시판
            </div>
            {/* 글 목록 | 글쓰기 버튼 */}
            <div className={styles.postContainer}>
                <div className={styles.wrtingsList_title}>
                    글 목록
                </div>
                <div
                    className={styles.go_write}
                    onClick={() => { setWriteState(!writeState) }}>
                    글쓰기
                </div>
            </div>
            {/* 문의글 List(10개씩) */}
            <table className={styles.table}>
                <tr className={styles.tableHeader}>
                    <td className={styles.topTitle_td}>제목</td>
                    <td className={styles.topWriter_td}>작성자</td>
                    <td className={styles.topdate_td}>작성일</td>
                    <td className={styles.topViewer_td}>조회수</td>
                </tr>
                {writeList.map((item, index) => {
                    return <tr key={index} className={styles.list}>
                        {/* 제목 - 최대 50글자로 정하기*/}
                        <td className={styles.td}>{item.title}</td>
                        {/* 작성자 */}
                        <td className={styles.td}>{item.writer}</td>
                        {/* 작성일 */}
                        <td className={styles.td}>{item.date}</td>
                        {/* 조회수 */}
                        <td className={styles.td}>{item.viewer}회</td>
                    </tr>
                })}
            </table>
            {/* write 모달창 */}
            {writeState
                ?
                <WriteModal
                    writeState={writeState}
                    setWriteState={setWriteState}
                    writeList={writeList}
                    setWriteList={setWriteList}
                />
                :
                null}
            {/* 페이지 번호() */}
        </div>
    )
}
