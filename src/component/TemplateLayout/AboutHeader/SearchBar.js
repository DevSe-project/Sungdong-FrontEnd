import { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../../customFn/useFetch';
import { useSearchActions, useSearchTerm, useSeperateSearchTerm } from '../../../store/DataStore';

export function SearchBar() {
  const navigate = useNavigate();
  const searchTerm = useSearchTerm();
  const {setSearchTerm, setFilterData} = useSearchActions();

  const {fetchAddPostServer} = useFetch();
  const queryClient = useQueryClient();

  //검색 요청
  const handleSearch = async (search) => {
    const getSearch = JSON.parse(sessionStorage.getItem('searchTerm'));
    return await fetchAddPostServer([search, getSearch.state.seperateSearchTerm], `post`, `/search/list`, 1, 10);
  };

  //검색 요청 Mutate
  const { mutate:searchMutate } = useMutation({mutationFn: handleSearch})

  // 검색 로직
  const handleOnChange = (event) => {
    // 입력 값을 저장하는 로직
    const query = event.target.value;
    setSearchTerm("search", query);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchMutate(searchTerm, {   
        onSuccess: (data) => {
          // 메세지 표시
          console.log('검색 : 검색되었습니다.', data);
          queryClient.setQueryData(['search'], () => {
            return data.data
          })          
          setFilterData(data.data.datas);
          // 카테고리로 이동
          navigate("/category");
        },
        onError: (error) => {
          //에러 처리
          console.error('상품을 검색하는 중 오류가 발생했습니다.', error);
        },
      });
    }
  };

  function handleSearchClicked(searchTerm){
    searchMutate(searchTerm, {   
      onSuccess: (data) => {
        // 메세지 표시
        console.log('검색 : 검색되었습니다.', data);
        queryClient.setQueryData(['search'], () => {
          return data.data
        })          
        setFilterData(data.data.datas);
        // 카테고리로 이동
        navigate("/category");
      },
      onError: (error) => {
        //에러 처리
        console.error('상품을 검색하는 중 오류가 발생했습니다.', error);
      },
    });
  }

  return (
    <div>
      <div className={styles.searchInputContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm.search}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
        />
        {/* 돋보기 아이콘 */}
        <i 
        onClick={() => {
          handleSearchClicked(searchTerm);
        }}
        className="fas fa-search" />
      </div>
    </div>
  );
}