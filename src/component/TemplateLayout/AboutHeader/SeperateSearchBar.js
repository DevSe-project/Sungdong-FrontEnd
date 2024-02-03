import styles from './SeperateSearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSearchActions, useSeperateSearchTerm } from '../../../Store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useFetch } from '../../../customFn/useFetch';

export function SeperateSearchBar() {
  const navigate = useNavigate();
  const seperateSearchTerm = useSeperateSearchTerm();
  const {setSeperateSearchTerm,resetSeperateSearchTerm} = useSearchActions();
  const queryClient = useQueryClient();
  const {fetchAddPostServer} = useFetch();

  //검색 요청
  const handleSearch = async (search) => {
    return await fetchAddPostServer(search, `post`, `/search/list`, 1, 5);
  };

      
  //검색 요청 Mutate
  const { searchMutate } = useMutation({mutationFn: handleSearch})
  

  const handleKeyDown = (event, search) => {
    if (event.key === 'Enter') {
        searchMutate(search, {   
        onSuccess: (data) => {
          // 메세지 표시
          alert(data.message);
          console.log('분리된 검색창 : 검색되었습니다.', data);
          // 다른 사용자들에게 영향을 주지 않고 현재 사용자의 컴포넌트에서만 새로운 데이터를 가져오기
          queryClient.invalidateQueries(['search'], { refetchActive: false });
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

  function handleSearchButton(search){
    searchMutate(search, {   
      onSuccess: (data) => {
        // 메세지 표시
        alert(data.message);
        console.log('분리된 검색창 : 검색되었습니다.', data);
        // 다른 사용자들에게 영향을 주지 않고 현재 사용자의 컴포넌트에서만 새로운 데이터를 가져오기
        queryClient.invalidateQueries(['search'], { refetchActive: false });
        // 카테고리로 이동
        navigate("/category");
      },
      onError: (error) => {
        //에러 처리
        console.error('상품을 검색하는 중 오류가 발생했습니다.', error);
      }
    })
  }
  

  return (
    <div>
      <div className={styles.searchInputContainer}>
      {Object.keys(seperateSearchTerm).map(inputName => (
        <input
        key={inputName}
        className={styles.searchInput}
        type="text"
        placeholder={
          inputName == 'product_title' 
          ? '상품명' 
          : inputName == 'product_brand'
          ? '브랜드'
          : inputName == 'product_spec'
          ? '규격'
          : inputName == 'product_id'
          ? '상품 코드'
          : inputName == 'product_model'
          && '모델명'
        }
        value={seperateSearchTerm[inputName]}
        onChange={e => setSeperateSearchTerm(inputName, e.target.value)}
        onKeyDown={handleKeyDown}
        />
        ))}
        {/* 돋보기 아이콘 */}
        <i 
        onClick={() => {
          handleSearchButton(seperateSearchTerm);
        }}
        className="fas fa-search" />
      </div>
    </div>
  );
}