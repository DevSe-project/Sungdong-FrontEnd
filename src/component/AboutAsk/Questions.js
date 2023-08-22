import styles from './Questions.module.css';
import { WritingsObj } from '../Data/WritingsObj';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WriteModal from './WriteModal';


export default function Questions() {
    // 문의하기 글쓰는 창을 나타내기 위한 state
    const [writeState, setWriteState] = useState(1);

    const [writeList, setWriteList] = useState(WritingsObj);

    // 글 list에 글을 넣는 작업


    return (
        <div className={styles.body}>
            {/* 문의글 검색 input */}
            <div className={styles.searchContainer}>
                <label for='search_input' className={styles.label_input}>검색</label>
                <input type='text' id='search_input' className={styles.search_input} />
                {/* <i className="fas fa-search" /> */}
            </div>
            {/* 글 목록 | 글쓰기 버튼 */}
            <div className={styles.postContainer}>
                <div className={styles.wrtingsList_title}>글 목록</div>
                <div className={styles.go_write} onClick={() => { setWriteState(!writeState) }}>문의하기</div>
            </div>
            {/* 문의글 List(10개씩) */}
            <ul className={styles.writing_ul}>
                {writeList.map((item, index) => {
                    return <li key={index} className={styles.writing_li}>
                        <div className={styles.writing_title}>{item.title}</div>
                        <div className={styles.writer}>작성자 - {item.writer}</div>
                    </li>
                })}
            </ul>
            {/* write 모달창 */}
            {writeState ? null : <WriteModal writeState={writeState} setWriteState={setWriteState}/>}
            {/* 페이지 번호() */}
        </div>
    )
}
