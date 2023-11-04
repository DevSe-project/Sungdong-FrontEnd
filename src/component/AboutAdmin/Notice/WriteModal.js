import styles from "./WriteModal.module.css";
import { useState, useEffect } from 'react';


// ----------------React-Quill----------------//
import 'react-quill/dist/quill.snow.css'; // 에디터 스타일
import Quill from 'quill';

// ReactQuill을 사용하기 전에 Quill 모듈을 확장 설정함.
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
// ----------------React-Quill---------------- //


export default function WrtieModal(props) {

    // esc키를 누르면 모달창 닫기.
    useEffect(() => {
        const handleEscapeKey = (event) => {
          if (event.key === 'Escape' && props.modal && props.modalName != '') {
            props.closeWriteModal();
          }
        };
    
        window.addEventListener('keydown', handleEscapeKey);
    
        return () => {
          window.removeEventListener('keydown', handleEscapeKey);
        };
      }, [props.modal, props.closeWriteModal]);

    

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
                {/* 작성자 */}
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
                    {/* 이 ReactQuill라이브러리의 기본 설정 중 하나로서 엔터 키를 눌렀을 때 자동으로 p태그가
                        생성되어 줄 바꿈을 표현하지 않습니다. */}
                </div>
            </div>

            {/* 첨부파일 */}
            <div>
                <input type="file" onChange={ () => {} } />
            </div>

            {/* 등록 버튼 */}
            <div className={styles.printPost} onClick={() => { props.addPost() }}>
                <div>등록</div>
            </div>
        </div>
    );
}
