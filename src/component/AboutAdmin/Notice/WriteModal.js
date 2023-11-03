import styles from "./WriteModal.module.css";
import { useEffect } from 'react';
import ReactQuill from 'react-quill-2';
import 'react-quill/dist/quill.snow.css'; // 에디터 스타일
import Quill from 'quill';

// ReactQuill을 사용하기 전에 Quill 모듈을 확장합니다.
const Break = Quill.import('blots/break');
Break.blotName = 'break';
Break.tagName = 'br';
Quill.register(Break);

// 모듈 구성
const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }], // 색상 설정 추가
        ['link'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

export default function WrtieModal(props) {

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const onClose = (event) => {
            if (event.key === 'Escape') {
                props.closeWriteModal();
            }
        };

        window.addEventListener('keydown', onClose);

        return () => {
            window.removeEventListener('keydown', onClose);
        };
    }, []);

    // 선택된 index가 있을 때만 렌더링
    return (
        <div className={styles.modalContainer}>
            {/* 종료 버튼 */}
            <div className={styles.closeButton}>
                <span onClick={() => {
                    props.closeWriteModal();
                }}>
                    <i className="fas fa-times"></i>
                </span>
            </div>
            {/* 본문 컨테이너 */}
            <div className={styles.contentsContainer}>
                {/* 제목 */}
                <div className={styles.title}>
                    Title <input className={styles.inputTitle} type="text" value={props.tempList.title} onChange={(e) => {
                        props.setTempList((prevdata) => ({
                            ...prevdata,
                            title: e.target.value
                        }))
                    }} required />
                </div>
                {/* 작성일과 작성자 */}
                <div className={styles.writer}>
                    작성자 : <input className={styles.inputWriter} type="text" value={props.tempList.writer} onChange={(e) => {
                        props.setTempList((prevdata) => ({
                            ...prevdata,
                            writer: e.target.value
                        }))
                    }} required />
                </div>
                {/* 글 내용 */}
                <div className={styles.content}>
                    <ReactQuill
                        className={styles.textarea}
                        value={props.tempList.contents}
                        onChange={(html) => {
                            props.setTempList((prevdata) => ({
                                ...prevdata,
                                contents: html
                            }))
                        }}
                        modules={modules}
                        required>
                    </ReactQuill>
                    {/* 이 ReactQuill라이브러리의 기본 설정 중 하나로서 엔터 키를 눌렀을 때 자동으로 p태그가
                        생성되어 줄 바꿈을 표현하지 않습니다. */}
                </div>
            </div>
            {/* 첨부파일 */}
            <input type="file" value={props.tempList.file} />
            {/* 등록 버튼 */}
            <div className={styles.printPost} onClick={() => { props.addPost() }}>
                <div>등록</div>
            </div>
        </div>
    );
}
