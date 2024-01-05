import { React, useEffect, useState } from 'react';
import styles from './AdminCategoryAddedModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState } from '../../../Store/DataStore';

export default function AdminCategoryAddedModal(props) {

  const navigate = useNavigate();

  const { isModal, modalName } = useModalState();

  const {selectedModalOpen, selectedModalClose, setModalName, closeModal} = useModalActions();

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);

  function InputForm() {
    const [inputs, setInputs] = useState([]);
  
    const handleAddInput = () => {
      if(inputs.length > 18){
        alert("카테고리는 최대 19개까지만 생성 가능합니다.");
        return;
      }
      setInputs([...inputs, '']);
    };
  
    const handleRemoveInput = (index) => {
      const newInputs = [...inputs];
      newInputs.splice(index, 1);
      setInputs(newInputs);
    };
  
    return (
      <div>
        {inputs.map((input, index) => (
          <div key={index} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.2em'}}>
            <input
              type='text'
              placeholder='카테고리를 입력하세요'
              value={input}
              style={{marginBottom: '0.5em'}}
              className={styles.input}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[index] = e.target.value;
                setInputs(newInputs);
              }}
            />
            <button className={styles.button} style={{marginBottom: '0.5em'}} onClick={() => handleRemoveInput(index)}>X</button>
          </div>
        ))}
        <button className={styles.addedButton} onClick={handleAddInput}>카테고리 추가</button>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Exit Button */}
        <div className={styles.exitButton}>
          <span onClick={() => { selectedModalClose(modalName) }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        {/* Title */}
        <div className={styles.modalContent}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              {modalName} 카테고리 추가
            </div>
          </div>
        </div>
        {/* 카테고리 추가 인풋란 생성 */}
        <div className={styles.codeContainer}>
            {InputForm()}
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button className={styles.selectedButton}>추가</button>
        </div>
      </div>
    </div>
  );
}
