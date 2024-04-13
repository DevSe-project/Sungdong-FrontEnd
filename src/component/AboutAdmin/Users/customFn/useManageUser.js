import { useState } from "react";
import axios from "../../../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useManagerUser() {


  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트

  const [matchedData, setMatchedData] = useState([]); // 서버의 user데이터를 불러올 state

  // AdminUserList 컴포넌트 내에서 editIndex 상태를 배열이 아닌 단일 값으로 선언합니다.
  const [editIndex, setEditIndex] = useState(null);

  // 수정할 데이터의 체크 상태를 관리하는 state(users_id를 담음)
  const [checkedItems, setCheckedItems] = useState([]);

  // handleToggleEdit 함수를 수정하여 editIndex를 배열에서 단일 값으로 업데이트합니다.
  const handleToggleEdit = (index) => {
    if (editIndex === index) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  };
  // 편집 상태 & 입력된 정보 & 체크리스트 초기화
  const initializingData = () => {
    if (editIndex !== null) {
      setEditIndex(null);
      setCheckedItems([]);
    }
  }

  

  // // ------------------------고객정보 업데이트 기능 시작------------------------ //
  // // 고객 단일 수정
  // const handleEdit = async (userData) => { // 
  //   try {
  //     const confirmMessage = '수정사항을 반영하시겠습니까?';
  //     const confirmed = window.confirm(confirmMessage);
  //     if (!confirmed) return;

  //     await editMutation(userData);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error('유저 수정 실패:', error);
  //     alert('유저 수정에 실패했습니다.');
  //   }
  // };
  // // 전체 수정 함수(정상작동 확인))
  // const handleBulkEdit = async () => {
  //   try {
  //     const confirmMessage = '수정사항을 반영하시겠습니까?';
  //     const confirmed = window.confirm(confirmMessage);
  //     if (!confirmed) return;
  //     const bulkUserData = []; // 수정된 데이터를 담을 배열을 초기화
  //     // 선택된 모든 사용자의 수정된 데이터를 추출하여 배열에 추가합니다.
  //     checkedItems.forEach((checkedID) => {
  //       const editedUserData = matchedData.find((user) => user.users_id === checkedID);
  //       bulkUserData.push(editedUserData);
  //     });
  //     await editMutation(bulkUserData); // 수정된 사용자 데이터 서버로 전송
  //   } catch (error) {
  //     console.error('전체 수정 실패:', error);
  //     alert('전체 수정에 실패했습니다.');
  //   }
  // };
  // const handleEditSuccess = (data) => { // 수정 성공
  //   console.log('수정 성공:', data);
  //   alert('수정이 완료되었습니다.');
  //   queryClient.invalidateQueries('holdusers');
  //   setEditIndex(null);
  // };
  // const handleEditError = (error) => { // 수정 실패
  //   console.error('수정 실패:', error);
  //   alert('수정에 실패했습니다.');
  // };
  // const fetchEditUser = async (userData) => { // Fetching
  //   try {
  //     const response = await axios.post('/auth/update', userData);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // };
  // const { mutate: editMutation } = useMutation({ // Mutation
  //   mutationFn: fetchEditUser,
  //   onSuccess: handleEditSuccess,
  //   onError: handleEditError,
  // });
  // // ------------------------고객정보 업데이트 기능 끝------------------------ //



  // // ------------------------삭제 기능 시작------------------------ //
  // // 고객 삭제
  // const fetchDeleteUser = async (userID) => { // Fetching
  //   try {
  //     const response = await axios.delete(`/auth/delete/${userID}`,)
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // const handleDelete = async (userID) => { // 사용 부분
  //   try {
  //     const confirmMessage = '선택된 고객을 정말 삭제하시겠습니까?';
  //     const confirmed = window.confirm(confirmMessage);
  //     if (!confirmed) return;

  //     await deleteMutation(userID);
  //   } catch (error) {
  //     handleDeleteError(error);
  //   }
  // };
  // const handleDeleteSuccess = (data) => { // 성공 시
  //   console.log('user Delete successfully:', data);
  //   alert(data.message);
  //   queryClient.invalidateQueries(['holdusers']);
  //   window.location.reload();
  // };
  // const handleDeleteError = (error) => { // 실패 시
  //   console.error('user Delete failed:', error);
  //   alert(error.message);
  // };
  // const { mutate: deleteMutation } = useMutation({ // Mutation
  //   mutationFn: fetchDeleteUser,
  //   onSuccess: handleDeleteSuccess,
  //   onError: handleDeleteError,
  // });
  // // ------------------------삭제 기능 끝------------------------ //

  // 전체 체크박스 업데이트
  function handleAllCheckbox(isChecked) {
    const checked = isChecked;

    if (checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      let idArray = matchedData?.map((item) => item.users_id);
      setCheckedItems(idArray);
      console.log(checkedItems);
    } else {
      // 모두 체킹 해제
      setCheckedItems([]);
      console.log(checkedItems);
    }
  }

  // 체크박스 개별 업데이트
  function handlePerCheckbox(checked, users_id) {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckedItems(prev => [...prev, users_id]);
      console.log(checkedItems);
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckedItems(checkedItems.filter((el) => el !== users_id));
      console.log(checkedItems);
    }
  }

  // 변경사항 업데이트
  const updateValue = (e, itemKey, itemIndex) => {
    console.log(checkedItems.length);
    // 여러 항목 업데이트
    if (checkedItems.length > 0) {
      const editData = e.target.value;
      const updateData = matchedData.map((item) => {
        // checkedItems에 포함된 사용자의 id와 일치하는 사용자의 데이터만 업데이트
        if (checkedItems.includes(item.users_id)) {
          return { ...item, [itemKey]: editData };
        }
        return item;
      });
      setMatchedData(updateData);
    }
    // 단일 항목 업데이트
    else {
      const editData = e.target.value;
      const newData = matchedData.map((item, idx) => {
        if (idx === itemIndex) {
          return { ...item, [itemKey]: editData };
        }
        return item;
      });
      setMatchedData(newData);
    }
  };

  const parseOptionValue = (itemKey, listItem) => {
    if (itemKey == 'userType_id') { // 고객구분
      switch (parseInt(listItem, 10)) {
        case 1:
          return "실사용자 A등급";
        case 2:
          return "납품업자 A등급";
        case 12:
          return "실사용자 B등급";
        case 13:
          return "실사용자 C등급";
        case 14:
          return "실사용자 D등급";
        case 22:
          return "납품업자 B등급";
        case 23:
          return "납품업자 C등급";
        case 24:
          return "납품업자 D등급";
        case 100:
          return "관리자";
        default:
          return "Error"
      }
    } else if (itemKey == 'hasCMS') { // CMS동의 여부
      if (listItem)
        return "동의";
      else
        return "비동의";
    }
    return `${listItem}`;
  }

  return {
    editIndex, setEditIndex,
    checkedItems, setCheckedItems,
    matchedData, setMatchedData,
    handleToggleEdit,
    initializingData,
    // handleEdit, handleBulkEdit,
    // handleDelete,
    handleAllCheckbox, handlePerCheckbox,
    updateValue,
    parseOptionValue,
  }
}