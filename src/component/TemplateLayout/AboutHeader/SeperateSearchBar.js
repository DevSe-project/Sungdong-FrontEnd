import styles from './SeperateSearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSearchActions, useSeperateSearchTerm } from '../../../Store/DataStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function SeperateSearchBar() {
  const navigate = useNavigate();
  const seperateSearchTerm = useSeperateSearchTerm();
  const {setSeperateSearchTerm,resetSeperateSearchTerm} = useSearchActions();
  const queryClient = useQueryClient();

  //검색 요청
  const handleSearch = async () => {
    try {
      const response = await axios.post("/search", 
        JSON.stringify({
          productName: seperateSearchTerm.productName,  // 예시: product가 객체이고 id 속성이 있는 경우
          productBrand: seperateSearchTerm.productBrand,
          productCode: seperateSearchTerm.productCode,
          productOption: seperateSearchTerm.productOption 
        }),
        {
          headers : {
            "Content-Type" : "application/json"
          }
        }
      )
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 검색하던 중 오류가 발생했습니다.');
    }
  };

      
  //검색 요청 Mutate
  const { searchMutate } = useMutation({mutationFn: handleSearch,
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
  })
  

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      try{
        searchMutate();
      } catch(error){
      event.preventDefault();
        // Update sessionStorage based on the selected result
        if (seperateSearchTerm.productName !== '') {
          sessionStorage.setItem('filterSearch', JSON.stringify(seperateSearchTerm.productName));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (seperateSearchTerm.productBrand !== '') {
          sessionStorage.setItem('filterSearchBrand', JSON.stringify(seperateSearchTerm.productBrand));
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearchOption');
        } else if (seperateSearchTerm.productCode) {
          sessionStorage.setItem('filterSearchCode', JSON.stringify(seperateSearchTerm.productCode));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearch');
          sessionStorage.removeItem('filterSearchOption');
        } else {
          sessionStorage.setItem('filterSearchOption', JSON.stringify(seperateSearchTerm.productOption));
          sessionStorage.removeItem('filterSearchBrand');
          sessionStorage.removeItem('filterSearchCode');
          sessionStorage.removeItem('filterSearch');
        }
        navigate("/category");
        resetSeperateSearchTerm();
      }
    }
  };
  

  return (
    <div>
      <div className={styles.searchInputContainer}>
      {Object.keys(seperateSearchTerm).map(inputName => (
        <input
        key={inputName}
        className={styles.searchInput}
        type="text"
        placeholder={
          inputName == 'productName' 
          ? '상품명' 
          : inputName == 'productBrand'
          ? '브랜드'
          : inputName == 'productCode'
          ? '코드'
          : inputName == 'productOption'
          && '옵션'
        }
        value={seperateSearchTerm[inputName]}
        onChange={e => setSeperateSearchTerm(inputName, e.target.value)}
        onKeyDown={handleKeyDown}
        />
        ))}
        {/* 돋보기 아이콘 */}
        <i 
        onClick={() => {
          //submitSearch();
          sessionStorage.setItem('filterSearch', JSON.stringify(seperateSearchTerm))
          navigate("/category")
          resetSeperateSearchTerm();
        }}
        className="fas fa-search" />
      </div>
    </div>
  );
}