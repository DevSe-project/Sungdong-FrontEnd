import { React, useEffect, useState } from 'react';
import styles from './AdminCategoryModal.module.css';
import { useModalActions, useModalState } from '../../../store/DataStore';
import axios from '../../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminCategoryAddedModal({selectedCategory, categoryData}) {

  const [inputs, setInputs] = useState([]);

  const { modalName } = useModalState();

  const {selectedModalOpen, selectedModalClose} = useModalActions();

  const queryClient = useQueryClient();

  const sendCategoriesToServer = async(category) => {
    try {
      // const token = GetCookie('jwt_token');
      const response = await axios.post("/category/create", 
        JSON.stringify(
          category
        ),
        {
          headers : {
            "Content-Type" : "application/json",
            // 'Authorization': `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  }

    //상품 등록 함수
    const { mutate:addCategoryMutation } = useMutation({mutationFn: sendCategoriesToServer})

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

  // 카테고리 내부 인풋란 추가하는 함수
  function InputForm() {  
    const handleAddInput = () => {
      switch(modalName){
        case "대": 
          if(inputs.length >= 10){
            alert("대 카테고리는 한 번에 최대 10개까지만 생성 가능합니다.");
            return;
          } else {
            setInputs([...inputs, '']);
          }
          break;
        case "중":
          if(inputs.length >= 15){
            alert("중 카테고리는 한 번에 최대 15개까지만 생성 가능합니다.");
            return;
          } else {
            setInputs([...inputs, '']);
          }
          break;
        case "소":
          if(inputs.length >= 20){
            alert("소 카테고리는 한 번에 최대 20개까지만 생성 가능합니다.");
            return;
          } else {
            setInputs([...inputs, '']);
          }
          break;
        default:
      }
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

  function handleAddCategory(){
    switch(modalName){
      case "대":
        const bigCategories = inputs.map((item) => ({
          name: item,
          parentsCategory_id: null
        }))
        addCategoryMutation(bigCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose("대");
            window.location.reload();
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
          },
        })
        break;
      case "중":
        const mediumCategories = inputs.map((item) => ({
          parentsCategory_id: selectedCategory.big,
          name: item
        }))
        addCategoryMutation(mediumCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose("중");
            window.location.reload();
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
          },
        });
        break;
      case "소":
        const lowCategories = inputs.map((item) => ({
          parentsCategory_id: selectedCategory.medium,
          name: item
        }))
        addCategoryMutation(lowCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose("소");
            window.location.reload();
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
          },
        });
      break;
      default:
    }
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
              <span style={{color: 'darkred', fontWeight: '650'}}>
              {modalName === "대" ? modalName : 
              modalName === "중" ? categoryData.find((item) => item.category_id === selectedCategory.big)?.name :
              modalName === "소" && categoryData.find((item) => item.category_id === selectedCategory.medium)?.name}</span> 카테고리 추가
            </div>
          </div>
        </div>
        {/* 카테고리 추가 인풋란 생성 */}
        <div className={styles.codeContainer}>
            {InputForm()}
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button onClick={()=> handleAddCategory()} className={styles.selectedButton}>추가</button>
        </div>
      </div>
    </div>
  );
}
