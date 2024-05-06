import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useUserFilter, useUserSort,
  usePageState, usePageAction,
  useIndexStore, useSetIndexStore
} from "../../../../store/DataStore";
import AdminDoneUser from "../AdminDoneUser";
import AdminHoldUser from "../AdminHoldUser";
import AdminUserFilter from "../AdminUserFilter";
import AdminUserSort from "../AdminUserSort";
import styles from "./UserList.module.css";
import { useFetch } from "../../../../customFn/useFetch";
import axios from "../../../../axios";
import { useState, useEffect } from "react";

const UserList = () => {

  const devideType = localStorage.getItem('devideType')
  const { fetchServer, fetchGetServer } = useFetch();
  const { itemsPerPage, currentPage } = usePageState();
  const { setCurrentPage, setTotalPages } = usePageAction();

  const queryClient = useQueryClient(); // 리액트 쿼리 클라이언트
  const [matchedData, setMatchedData] = useState([]);
  const { onIndex } = useIndexStore();
  const { setOnIndex } = useSetIndexStore()
  const [checkedItems, setCheckedItems] = useState([]);

  const isAllCheckboxState = checkedItems.length === matchedData?.length ? true : false;
  const checkboxBatchHandler = (e) => {
    // Debuggig code
    console.log(`\n\n\n== th - <input/> ==`);
    console.log(`1. checkedItems.length: ${checkedItems.length}`);
    console.log(`2. matchedData.length: ${matchedData.length}`);
    console.log(`3. Current Checked State: ${e.target.checked}`);
    if (isAllCheckboxState) { // 체크박스가 체크돼있으면 체크박스 아이템을 비움
      setCheckedItems([]);
    } else { // 체크됐지 않으면 아이템을 채워서 체크되도록 함
      const newCheckedItems = matchedData.map(item => item.users_id);
      setCheckedItems(newCheckedItems);
    }
  }
  const checbkoxEachHandler = (uesrs_id) => {
    const isChecked = checkedItems.includes(uesrs_id)
    console.log(`\n\n\n== <td> - <input type='checkbox'/> ==`);
    console.log(`- ${uesrs_id} isIncludes? : ${isChecked}`);;
    if (isChecked) {// 체크돼있으면 해당 id 삭제
      setCheckedItems(() => checkedItems.filter(item => item !== uesrs_id))
    }
    else { setCheckedItems(() => [...checkedItems, uesrs_id]) }// 체크 안 돼있으면 해당 id 추가
  }



  // ------------------------------userData Fetch------------------------------ //

  // 유저 데이터 Fetch
  const fetchUsersData = async () => {
    console.log(`\nUserList: 요청 타입 = ${devideType}`);
    try {
      const data = await fetchGetServer(`/auth/read/${devideType}`, currentPage);
      return data.data;
    } catch (error) {
      throw new Error('고객 정보를 불러오는 중 오류가 발생하였습니다.');
    }
  }
  // useQuery
  const { isLoading, isError, error, data: userData } = useQuery({
    queryKey: [`users`, devideType, currentPage, itemsPerPage], // currentPage, itemPerPage가 변경될 때마다 재실행하기 위함
    queryFn: fetchUsersData,
  });

  // matchedData에 요청받은 userData저장
  useEffect(() => {
    console.log(`\n\n\nUserList: ${onIndex}`);
    if (userData)
      setMatchedData(userData);
  }, [userData, itemsPerPage, currentPage]);


  // ------------------------------userData Fetch------------------------------ //


  // ------------------------고객정보 업데이트------------------------ //

  const handleEdit = async (userData) => { // 고객 단일 수정
    try {
      const confirmMessage = '수정사항을 반영하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;

      await editMutation(userData);
      window.location.reload();
    } catch (error) {
      console.error('유저 수정 실패:', error);
      alert('유저 수정에 실패했습니다.');
    }
  };

  const handleBulkEdit = async () => {// 전체 수정 함수(정상작동 확인))
    try {
      const confirmMessage = '수정사항을 반영하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
      const bulkUserData = []; // 수정된 데이터를 담을 배열을 초기화
      // 선택된 모든 사용자의 수정된 데이터를 추출하여 배열에 추가합니다.
      checkedItems.forEach((checkedID) => {
        const editedUserData = setMatchedData.find((user) => user.users_id === checkedID);
        bulkUserData.push(editedUserData);
      });
      await editMutation(bulkUserData); // 수정된 사용자 데이터 서버로 전송
    } catch (error) {
      console.error('전체 수정 실패:', error);
      alert('전체 수정에 실패했습니다.');
    }
  };

  const handleEditSuccess = (data) => { // 수정 성공
    console.log('수정 성공:', data);
    alert('수정이 완료되었습니다.');
    queryClient.invalidateQueries('users');
    setOnIndex(null);
  };

  const handleEditError = (error) => { // 수정 실패
    console.error('수정 실패:', error);
    alert('수정에 실패했습니다.');
  };

  const fetchEditUser = async (userData) => { // Fetching
    try {
      const response = await axios.post('/auth/update', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { mutate: editMutation } = useMutation({ // Mutation
    mutationFn: fetchEditUser,
    onSuccess: handleEditSuccess,
    onError: handleEditError,
  });

  // ------------------------고객정보 업데이트 기능 끝------------------------ //



  // ------------------------삭제 기능 시작------------------------ //

  const fetchDeleteUser = async (userID) => { // 고객 삭제
    try {
      const response = await axios.delete(`/auth/delete/${userID}`,)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const handleDelete = async (userID) => { // 사용 부분
    try {
      const confirmMessage = '선택된 고객을 정말 삭제하시겠습니까?';
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;

      await deleteMutation(userID);
    } catch (error) {
      handleDeleteError(error);
    }
  };

  const handleDeleteSuccess = (data) => { // 성공 시
    console.log('user Delete successfully:', data);
    alert(data.message);
    queryClient.invalidateQueries(['users']);
    window.location.reload();
  };

  const handleDeleteError = (error) => { // 실패 시
    console.error('user Delete failed:', error);
    alert(error.message);
  };

  const { mutate: deleteMutation } = useMutation({ // Mutation
    mutationFn: fetchDeleteUser,
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
  });

  // ------------------------삭제 기능 끝------------------------ //




  // ------------------------필터링 기능 시작------------------------ //

  const userFilter = useUserFilter();

  const fetchFilteredUser = async (userFilter) => {
    console.log(userFilter);
    return await fetchServer(userFilter, `post`, `/auth/filtering/${devideType}`, currentPage);
  }

  const { mutate: filteringMutation } = useMutation({ mutationFn: fetchFilteredUser });

  const onFiltering = (userFilter) => {
    console.log(`전달할 때 값: ${userFilter.cor_ceoName}`)
    filteringMutation(userFilter, {
      onSuccess: (data) => {
        console.log('고객 필터링이 성공적으로 완료되었습니다.\n', data.data.data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData([`users`, devideType, currentPage, itemsPerPage], () => {
          return data.data.data;
        })
      },
      onError: (error) => {
        console.error('필터링에 실패했습니다.\n', error);
        // 에러 처리 또는 메시지 표시
        alert(error.message);
      },
    });
  };

  // ------------------------필터링 기능 끝------------------------ //



  // ------------------------정렬 기능 시작------------------------ //

  const userSort = useUserSort();

  const fetchSortedUser = async (userSort) => {

    // console.log(`선택된 정렬: ${userSort}`);
    console.log(userSort);
    return await fetchServer(userSort, `post`, `/auth/sorting/${devideType}`, currentPage);
  };

  const { mutate: sortingMutation } = useMutation({ mutationFn: fetchSortedUser }); // 정렬

  const onSorting = () => {
    sortingMutation(userSort, {
      onSuccess: (data) => {
        // Debuggig Code : data.data.data
        console.log('고객 정렬이 성공적으로 완료되었습니다.\n', data.data.data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        // 다른 로직 수행 또는 상태 업데이트
        queryClient.setQueryData([`users`, devideType, currentPage, itemsPerPage], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        console.error('user Sorted failed:', error);
        // 에러 처리 또는 메시지 표시
        alert(error);
      },
    });
  };

  // ------------------------정렬 기능------------------------ //



  // ------------------------------해당 인덱스 수정기능 토글------------------------------ //

  // handleToggleEdit 함수를 수정하여 onIndex를 배열에서 단일 값으로 업데이트합니다.
  const handleToggleEdit = (idx) => {
    if (onIndex === idx) {
      setOnIndex(-1);
    } else {
      setOnIndex(idx);
    }
  };

  // 편집 상태 & 입력된 정보 & 체크리스트 초기화
  const initializingData = () => {
    setOnIndex(-1);
    setCheckedItems([]);
  }

  // ------------------------------해당 인덱스 수정기능 토글------------------------------ //



  // ------------------------------변경사항 업데이트------------------------------ //

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

  // ------------------------------변경사항 업데이트------------------------------ //



  // ------------------------------모달 keyDown event------------------------------ //

  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        initializingData();
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [initializingData]);

  // ------------------------------모달 keyDown event------------------------------ //



  // ------------------------페이지 로딩 Section------------------------ //

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>오류가 발생했습니다.</div>;

  // ------------------------페이지 로딩 Section------------------------ //

  return (
    <div className={styles.body}>
      {/* Flex Container */}
      <div className={styles.flexContainer}>
        {/* 필터링 */}
        <AdminUserFilter onFiltering={onFiltering} />
        {/* 정렬 */}
        <AdminUserSort onSorting={onSorting} />
      </div>

      {
        devideType == 'done'
          ?
          <AdminDoneUser
            matchedData={matchedData}
            handleBulkEdit={handleBulkEdit}
            handleEdit={handleEdit}
            handleToggleEdit={handleToggleEdit}
            handleDelete={handleDelete}
            updateValue={updateValue}
            initializingData={initializingData}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            isAllCheckboxState={isAllCheckboxState}
            checkboxBatchHandler={checkboxBatchHandler}
            checkboxEachHandler={checbkoxEachHandler} />
          :
          <AdminHoldUser
            matchedData={matchedData}
            handleBulkEdit={handleBulkEdit}
            handleEdit={handleEdit}
            handleToggleEdit={handleToggleEdit}
            handleDelete={handleDelete}
            updateValue={updateValue}
            initializingData={initializingData}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            isAllCheckboxState={isAllCheckboxState}
            checkboxBatchHandler={checkboxBatchHandler}
            checkboxEachHandler={checbkoxEachHandler} />
      }
    </div>
  )
}

export default UserList;