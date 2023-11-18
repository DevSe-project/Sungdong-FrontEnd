import { useEffect, useRef, useState } from 'react';
import styles from './SeperateSearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSearchActions, useSeperateSearchTerm } from '../../../Store/DataStore';

export function SeperateSearchBar() {
  const navigate = useNavigate();
  const seperateSearchTerm = useSeperateSearchTerm();
  const {setSeperateSearchTerm,resetSeperateSearchTerm} = useSearchActions();


  const handleKeyDown = event => {
    if (event.key === 'Enter') {
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