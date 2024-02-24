import { useEffect } from 'react';
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

  /**
   * @카테고리필터링 대 카테고리 필터
   * @returns {*} categoryData에서 필터링 구성
   * - 대 카테고리 필터 방식 : A로 시작하여 Z로 끝나는 문자열
   * - 중 카테고리 필터 방식 : [상위카테고리ID] + 소문자 a로 시작하여 z로 끝나는 문자열
   * - 소 카테고리 필터 방식 : [상위카테고리ID] + 숫자 1~9까지로 구성되는 최대 3글자(숫자 100까지)로 끝나는 문자열
   */
  function FilteredHighCategoryData() {
    return categoryData.filter(element => /^[A-Z]$/.test(element.category_id));
  }

  /**
   * @카테고리필터링 중 카테고리 필터
   * @returns {*} categoryData에서 필터링 구성
   * - 대 카테고리 필터 방식 : A로 시작하여 Z로 끝나는 문자열
   * - 중 카테고리 필터 방식 : [상위카테고리ID] + 소문자 a로 시작하여 z로 끝나는 문자열
   * - 소 카테고리 필터 방식 : [상위카테고리ID] + 숫자 1~9까지로 구성되는 최대 3글자(숫자 100까지)로 끝나는 문자열
   */
  function FilteredMiddleCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.category_id));
  }
  /**
   * @카테고리필터링 소 카테고리 필터
   * @returns {*} categoryData에서 필터링 구성
   * - 대 카테고리 필터 방식 : A로 시작하여 Z로 끝나는 문자열
   * - 중 카테고리 필터 방식 : [상위카테고리ID] + 소문자 a로 시작하여 z로 끝나는 문자열
   * - 소 카테고리 필터 방식 : [상위카테고리ID] + 숫자 1~9까지로 구성되는 최대 3글자(숫자 100까지)로 끝나는 문자열
   */
  function FilteredLowCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.category_id));
  }

  /**
   * @카테고리필터
   * 태그를 리턴하는 형식의 간소화를 위한 함수
   * @returns {*} 대분류, 중분류, 소분류 select - option 태그 리턴
   */
  function categoryFilter() {
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <select className={styles.select} value={productFilter.category.highId} onChange={(e) => setProductCategory("highId", e.target.value)}>
          <option value="">대분류</option>
          {categoryData && FilteredHighCategoryData().map((item, index) =>
            <option key={index} value={item.category_id}>{item.name}</option>
          )}
        </select>
        <select className={styles.select} value={productFilter.category.middleId} onChange={(e) => setProductCategory("middleId", e.target.value)}>
          <option value="">중분류</option>
          {productFilter.category.highId !== '' && categoryData && FilteredMiddleCategoryData(productFilter.category.highId)?.map((item, key) =>
            <option key={key} value={item.category_id}>{item.name}</option>
          )}
        </select>
        <select className={styles.select} value={productFilter.category.lowId} onChange={(e) => setProductCategory("lowId", e.target.value)}>
          <option value="">소분류</option>
          {productFilter.category.middleId !== '' && categoryData && FilteredLowCategoryData(productFilter.category.middleId)?.map((item, key) =>
            <option key={key} value={item.category_id}>{item.name}</option>
          )}
        </select>
      </div>
    )
  }

  /**
   * @날짜필터
   * - created : 상품 등록일을 기준으로 필터링
   * - updated : 상품 최근 수정일을 기준으로 필터링
   */
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

  /**
   * @재고필터
   * 10 ~ 500개 미만의 재고를 필터링하는 함수 구성
   * @returns {*} 재고 개수에 따른 필터링 select - option 리턴 
   */
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

  /**
   * @상태필터
   * 전체, 판매대기, 판매중, 판매완료, 판매중단 5개의 필터 구성
   * @returns 판매 상태에 따른 필터링 select - oprion 리턴
   */
  function saleStatus() {
    const selectAll = productFilter.state.length === 4;
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value="전체"
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
              name="상태"
              value="판매대기"
              checked={productFilter.state.includes("판매대기")}
              onChange={(e) => {
                handleCheckboxChange(e.target.value);
              }}
            />
            판매대기
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value="판매중"
              checked={productFilter.state.includes("판매중")}
              onChange={(e) => {
                handleCheckboxChange(e.target.value);
              }}
            />
            판매중
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value="판매완료"
              checked={productFilter.state.includes("판매완료")}
              onChange={(e) => {
                handleCheckboxChange(e.target.value);
              }}
            />
            판매완료
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value="판매중단"
              checked={productFilter.state.includes("판매중단")}
              onChange={(e) => {
                handleCheckboxChange(e.target.value);
              }}
            />
            판매중단
          </label>
        </div>
      </div>
    )
  }

/**
 * @검색어필터
 * 상품명, 브랜드명, 상품번호 3개의 검색 필터 제공
 * @returns 상품명, 상품브랜드, 상품코드를 찾기 위한 인풋 태그 리턴
 */
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
          <button className={styles.button} onClick={(e) => {
            e.preventDefault();
            handleSearch()
          }}>
            검색  
          </button>
          <button className={styles.button} onClick={() => {
            resetProductFilter()
            window.location.reload();
            }}>
            초기화
          </button>
        </div>
      </form>
    </div>
  )
}


