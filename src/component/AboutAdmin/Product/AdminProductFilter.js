import { useEffect, useState } from 'react';
import { useProductFilter, useProductFilterActions } from '../../../store/DataStore'
import styles from './AdminProductFilter.module.css'
import { useQuery } from '@tanstack/react-query';
export function AdminProductFilter({ handleSearch }) {
  const productFilter = useProductFilter();
  const { setProductFilter, resetProductFilter, setProductDate, setProductCategory, setCheckboxState, setAllCheckboxState } = useProductFilterActions();
  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });

  useEffect(() => {
    return () => {
      resetProductFilter();
      // 컴포넌트가 언마운트될 때 Product 필터 상태 리셋
    };
  }, []);

  const handleCheckboxChange = (name) => {
    setCheckboxState(name);
  };

  //대 카테고리 필터링
  function FilteredHighCategoryData() {
    return categoryData.filter(element => /^[A-Z]$/.test(element.category_id));
  }

  //중 카테고리 필터링
  function FilteredMiddleCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.category_id));
  }

  //소 카테고리 필터링
  function FilteredLowCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.category_id));
  }


  function categoryFilter() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <select className={styles.select} value={productFilter.category.highId} onChange={(e) => setProductCategory("highId", e.target.value)}>
          <option value={''}>대분류</option>
          {categoryData && FilteredHighCategoryData().map((item, index) =>
            <option key={index} value={item.category_id}>{item.name}</option>
          )}
        </select>
        <select className={styles.select} value={productFilter.category.middleId} onChange={(e) => setProductCategory("middleId", e.target.value)}>
          <option value={''}>중분류</option>
          {productFilter.category.highId !== '' && categoryData && FilteredMiddleCategoryData(productFilter.category.highId)?.map((item, key) =>
            <option key={key} value={item.category_id}>{item.name}</option>
          )}
        </select>
        <select className={styles.select} value={productFilter.category.lowId} onChange={(e) => setProductCategory("lowId", e.target.value)}>
          <option value={''}>소분류</option>
          {productFilter.category.middleId !== '' && categoryData && FilteredLowCategoryData(productFilter.category.middleId)?.map((item, key) =>
            <option key={key} value={item.category_id}>{item.name}</option>
          )}
        </select>
      </div>
    )
  }

  function dateFilter() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <select className={styles.select} value={productFilter.dateType} onChange={(e) => setProductFilter('dateType', e.target.value)}>
          <option value="">선택</option>
          <option value={'created'}>상품 등록일</option>
          <option value={'updated'}>최종 수정일</option>
        </select>
        <div>
          <input className={styles.select} type='date' value={productFilter.date.start} onChange={(e) => setProductDate('start', e.target.value)}></input>
          &nbsp;~&nbsp;
          <input className={styles.select} type='date' value={productFilter.date.end} onChange={(e) => setProductDate('end', e.target.value)}></input>
        </div>
      </div>
    )
  }

  function detailSearch() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <select className={styles.select} value={productFilter.product_supply} onChange={(e) => setProductFilter('product_supply', e.target.value)}>
          <option value={''}>재고</option>
          <option value={`10`}>10개 미만</option>
          <option value={`50`}>50개 미만</option>
          <option value={`100`}>100개 미만</option>
          <option value={`200`}>200개 미만</option>
          <option value={`300`}>300개 미만</option>
          <option value={`500`}>500개 미만</option>
        </select>
      </div>
    )
  }

  function saleStatus() {
    const selectAll = productFilter.state.length === 4;
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="전체"
              checked={selectAll}
              onChange={(e) => {
                setAllCheckboxState(selectAll);
              }}
            />
            전체
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="판매대기"
              checked={productFilter.state.includes("판매대기")}
              onChange={(e) => {
                handleCheckboxChange(e.target.name);
              }}
            />
            판매대기
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="판매중"
              checked={productFilter.state.includes("판매중")}
              onChange={(e) => {
                handleCheckboxChange(e.target.name);
              }}
            />
            판매중
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="판매완료"
              checked={productFilter.state.includes("판매완료")}
              onChange={(e) => {
                handleCheckboxChange(e.target.name);
              }}
            />
            판매완료
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="판매중단"
              checked={productFilter.state.includes("판매중단")}
              onChange={(e) => {
                handleCheckboxChange(e.target.name);
              }}
            />
            판매중단
          </label>
        </div>
      </div>
    )
  }


  function searchWord() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품명을 입력해주세요' value={productFilter.product_title} onChange={(e) => setProductFilter('product_title', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='브랜드명을 입력해주세요' value={productFilter.product_brand} onChange={(e) => setProductFilter('product_brand', e.target.value)} />
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품번호를 입력해주세요' value={productFilter.product_id} onChange={(e) => setProductFilter('product_id', e.target.value)} />
        </div>
      </div>
    )
  }

  const filterList = [
    { label: '검색어', content: searchWord() },
    { label: '판매상태', content: saleStatus() },
    { label: '카테고리', content: categoryFilter() },
    { label: '기간', content: dateFilter() },
    { label: '상세검색', content: detailSearch() },
  ]

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div style={{ width: '100%' }}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray' }}>
          <h4 style={{ fontSize: '1.2em', fontWeight: '650' }}>필터</h4>
        </div>
        {filterList.map((item, index) => (
          <div key={index} className={styles.container}>
            <div className={styles.label}>
              {item.label}
            </div>
            <div className={styles.content}>
              {item.content}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5em' }}>
          <input className={styles.button} value='검색' onClick={() => handleSearch()} />
          <input className={styles.button} type='reset' onClick={() => {
            resetProductFilter()
            window.location.reload();
            }} />
        </div>
      </form>
    </div>
  )
}


