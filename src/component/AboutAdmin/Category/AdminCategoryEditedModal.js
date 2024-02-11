import { React, useEffect, useState } from 'react';
import styles from './AdminCategoryModal.module.css';
import { useNavigate } from 'react-router-dom';
import { useModalActions, useModalState } from '../../../store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from '../../../axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminCategoryEditedModal({selectedCategory, categoryData}) {

  const [inputs, setInputs] = useState([]);

  const navigate = useNavigate();

  const { modalName } = useModalState();

  const {selectedModalOpen, selectedModalClose} = useModalActions();

  const queryClient = useQueryClient();

  const sendCategoriesToServer = async(category) => {
    try {
      const response = await axios.patch("/category/edit", 
        JSON.stringify(
          category
        ),
        {
          headers : {
            "Content-Type" : "application/json",
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

  
    //카테고리 수정 함수
    const { mutate:editCategoryMutation } = useMutation({mutationFn: sendCategoriesToServer});

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


  //필터링 함수 호출
  useEffect(() => {
    if (modalName === "수정 : 대") {
      FilteredHighCategoryData();
    } else if (modalName === "수정 : 중") {
      FilteredMiddleCategoryData(selectedCategory.big);
    } else if (modalName === "수정 : 소") {
      FilteredLowCategoryData(selectedCategory.medium);
    }
  }, [modalName, selectedCategory]);

    //대 카테고리 필터링
    function FilteredHighCategoryData() {
      const newData = categoryData.filter(element => /^[A-Z]$/.test(element.category_id));
      setInputs(newData);
    }

    //중 카테고리 필터링
    function FilteredMiddleCategoryData(itemId) {
      const newData = categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.category_id));
      setInputs(newData);
    }

    //소 카테고리 필터링
    function FilteredLowCategoryData(itemId) {
      const newData = categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.category_id));
      setInputs(newData);
    }


  // 카테고리 인풋 함수
  function InputForm() { 
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
              value={input.name}
              style={{marginBottom: '0.5em'}}
              className={styles.input}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[index].name = e.target.value;
                setInputs(newInputs);
              }}
            />
            <button className={styles.button} style={{marginBottom: '0.5em'}} onClick={() => handleRemoveInput(index)}>X</button>
          </div>
        ))}
      </div>
    );
  }

  function handleConfirmCategory(){
    switch(modalName){
      case "수정 : 대":
        const bigCategories = inputs.map((item) => ({
          parentsCategory_id: null,
          category_id: item.category_id,
          name: item.name
        }))
        editCategoryMutation(bigCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose(modalName);
            window.location.reload();
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
          },
        })
        break;
      case "수정 : 중":
        const mediumCategories = inputs.map((item) => ({
          parentsCategory_id: selectedCategory.big,
          category_id: item.category_id,
          name: item.name
        }))
        editCategoryMutation(mediumCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose(modalName);
            window.location.reload();
          },
          onError: (error) => {
            // 상품 추가 실패 시, 에러 처리를 수행합니다.
            console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
          },
        });
        break;
      case "수정 : 소":
        const lowCategories = inputs.map((item) => ({
          parentsCategory_id: selectedCategory.medium,
          category_id: item.category_id,
          name: item.name            
        }))
        editCategoryMutation(lowCategories,{
          onSuccess: (data) => {
            // 메세지 표시
            alert(data.message);
            console.log('카테고리가 추가/변경 되었습니다.', data);
            // 상태를 다시 불러와 갱신합니다.
            queryClient.invalidateQueries(['category']);
            selectedModalClose(modalName);
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
              {modalName === "수정 : 대" ? '대' : 
              modalName === "수정 : 중" ? categoryData.find((item) => item.category_id === selectedCategory.big)?.name :
              modalName === "수정 : 소" && categoryData.find((item) => item.category_id === selectedCategory.medium)?.name}</span> 카테고리 수정
            </div>
          </div>
        </div>
        {/* 카테고리 인풋란 생성 */}
        <div className={styles.codeContainer}>
            {InputForm()}
        </div>
        <div className={styles.buttonBox}>
          <button onClick={()=> selectedModalClose(modalName)} className={styles.selectButton}>취소</button>
          <button onClick={()=> handleConfirmCategory()} className={styles.selectedButton}>적용</button>
        </div>
      </div>
    </div>
  );
}
