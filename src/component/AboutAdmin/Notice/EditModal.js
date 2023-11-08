import styles from './WriteEditModal.module.css';
import { useEffect, useState } from 'react';

export default function EditModal(props) {
    const [tempData, setTempData] = useState({
        title: props.list[props.selectedItemIndex].title,
        writer: props.list[props.selectedItemIndex].writer,
        contents: props.list[props.selectedItemIndex].contents,
    });

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                props.closeWriteModal();
            }
        };

        window.addEventListener('keydown', handleEscapeKey);

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [props]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        // 수정된 내용을 저장하는 로직을 추가하세요.
        // tempData에 있는 수정된 내용을 이용해 공지사항을 업데이트하도록 구현해야 합니다.
        const updatedData = {
            title: tempData.title,
            writer: tempData.writer,
            contents: tempData.contents,
        };

        // 수정된 내용을 부모 컴포넌트로 전달
        props.updateNotice(props.selectedItemIndex, updatedData);

        // 모달 닫기
        props.closeWriteModal();
    };

    return (
        <div className={styles.modalOveray}>
            <div className={styles.modalContainer}>
                <div className={styles.closeButton}>
                    <span onClick={props.closeWriteModal}>
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
