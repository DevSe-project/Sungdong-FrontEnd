import styles from "./WriteEditModal.module.css";
import { useState, useEffect } from 'react';


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
                    <textarea
                        className={styles.textarea}
                        value={props.tempList.contents}>

                    </textarea>
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
