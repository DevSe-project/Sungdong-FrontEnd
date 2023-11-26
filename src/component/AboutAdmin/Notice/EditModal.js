import styles from './WriteEditModal.module.css';
import { useEffect, useState } from 'react';
import { useModalActions, useModalState, useNoticePostList } from "../../../Store/DataStore";

export default function EditModal(props) {
    // call_글 목록
    const noticePostList = useNoticePostList();
    // call_modalZustand
    const { selectedModalClose, setSelectedIndex } = useModalActions();
    const {selectedIndex} = useModalState();
    // setting_space_for_input
    const [tempData, setTempData] = useState({
        title: noticePostList[selectedIndex]?.title || '',
        writer: noticePostList[selectedIndex]?.writer || '',
        contents: noticePostList[selectedIndex]?.contents || '',
        files: noticePostList[selectedIndex]?.files || '',
    });

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setSelectedIndex(null);
                selectedModalClose();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [selectedModalClose]);

    // [임시]setSelectedIndex가 동작 후에 selectedIndex 값을 추적하기 위한 useEffect
    useEffect(() => {
        console.log(selectedIndex)
    }, [selectedIndex])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        const updatedData = {
            title: tempData.title,
            writer: tempData.writer,
            contents: tempData.contents,
            files: tempData.files,
        };

        // 수정된 내용을 부모 컴포넌트로 전달
        props.editNotice(selectedIndex, updatedData);

        // 선택 인덱스 초기화
        setSelectedIndex(null);
        // 모달 닫기
        selectedModalClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.closeButton}>
                    <span onClick={selectedModalClose}>
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                <div className={styles.contentsContainer}>
                    {/* Title */}
                    <div className={styles.title}>
                        Title
                        <input
                            className={styles.inputTitle}
                            type="text"
                            name="title"
                            value={tempData.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Writer */}
                    <div className={styles.writer}>
                        작성자
                        <input
                            className={styles.inputWriter}
                            type="text"
                            name="writer"
                            value={tempData.writer}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Contents */}
                    <div className={styles.content}>
                        <textarea
                            className={styles.textarea}
                            name="contents"
                            value={tempData.contents}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* add Files */}
                <div>
                    <input type="file" onChange={() => { }} />
                </div>

                {/* Save Button */}
                <div className={styles.buttonContainer}>
                    <div className={styles.printPost} onClick={handleSaveChanges}>
                        <div>저장</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
