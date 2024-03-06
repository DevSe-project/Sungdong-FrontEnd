import { useEffect, useRef, useState } from 'react';
import styles from './AdminHeaderSearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../../../customFn/useFetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminSearchActions, useAdminSearchTerm } from '../../../../store/DataStore';

export function AdminHeaderSearchBar(props) {
  const navigate = useNavigate();
  // 검색 State
  const searchTerm = useAdminSearchTerm();
  const {setSearchTerm} = useAdminSearchActions();

  const {fetchAddPostServer} = useFetch();
  const queryClient = useQueryClient();

  //검색 요청
  const handleSearch = async (search) => {
    return await fetchAddPostServer(search, `post`, `/search/admin/list`, 1, 10);
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
          queryClient.setQueryData(['adminSearch'], () => {
            return data.data.data
          })          
          // 카테고리로 이동
          navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/search");
          window.location.reload();
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
        queryClient.setQueryData(['adminSearch'], () => {
          return data.data.data
        })          
        // 카테고리로 이동
        navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/search");
        window.location.reload();
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
        <select 
        className={styles.select}
        name="searchFilter"
        value={searchTerm.searchFilter}              
        onChange={(e)=>setSearchTerm("searchFilter", e.target.value)}
        >
          <option value='uc.cor_corName'>
            업체명
          </option>
          <option value='p.product_id'>
            상품코드
          </option>
          <option value='uc.cor_num'>
            사업자번호
          </option>
          <option value='d.delivery_num'>
            송장번호
          </option>
        </select>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="주문 상품에 대한 검색어를 입력하세요"
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