import { useEffect, useState } from 'react';
import { useProductFilter, useProductFilterActions } from '../../../store/DataStore'
import styles from './AdminProductFilter.module.css'
export function AdminProductFilter({handleSearch}){
  const productFilter = useProductFilter();
  const {setProductFilter, resetProductFilter, setProductDate, setProductCategory, setCheckboxState, setAllCheckboxState} = useProductFilterActions();
  
  useEffect(() => {
    return () => {
      resetProductFilter();
      // 컴포넌트가 언마운트될 때 Product 필터 상태 리셋
    };
  }, []);

    const handleCheckboxChange = (name) => {
      setCheckboxState(name);
    };
  
    const handleAllCheckboxChange = () => {
      setAllCheckboxState();
    };

  function categoryFilter(){
    return(
      <div style={{display: 'flex', gap: '0.5em'}}>
        <select className={styles.select} value={productFilter.category.highId} onChange={(e)=>setProductCategory("highId", e.target.value)}>
          <option value={''}>대분류</option>
          <option>대대대</option>
        </select>
        <select className={styles.select} value={productFilter.category.middleId} onChange={(e)=>setProductCategory("middleId", e.target.value)}>
          <option value={''}>중분류</option>
          <option>중중중</option>
        </select>
        <select className={styles.select} value={productFilter.category.lowId} onChange={(e)=>setProductCategory("lowId", e.target.value)}>
          <option value={''}>소분류</option>
          <option>소소소</option>
        </select> 
      </div>
    )
  }
  
  function dateFilter(){
    return(
      <div style={{display: 'flex', gap: '1em'}}>
        <select className={styles.select} value={productFilter.dateType} onChange={(e)=>setProductFilter('dateType', e.target.value)}>
          <option value={'added'}>상품 등록일</option>
          <option value={'sales'}>판매 시작일</option>
          <option value={'end'}>판매 종료일</option>
          <option value={'final'}>최종 수정일</option>
        </select>
        <div>
          <input className={styles.select} type='date' value={productFilter.date.start} onChange={(e)=>setProductDate('start', e.target.value)}></input> 
          &nbsp;~&nbsp;
          <input className={styles.select} type='date' value={productFilter.date.end} onChange={(e)=>setProductDate('end', e.target.value)}></input>
        </div>
      </div>
    )
  }

  function detailSearch(){
    return(
      <div style={{display: 'flex', gap: '1em'}}>
        <select className={styles.select} value={productFilter.supply} onChange={(e)=>setProductFilter('supply', e.target.value)}>
          <option value={''}>재고</option>
          <option value={`<10`}>10개 미만</option>
          <option value={`<50`}>50개 미만</option>
          <option value={`<100`}>100개 미만</option>
          <option value={`<200`}>200개 미만</option>
          <option value={`<300`}>300개 미만</option>
          <option value={`<500`}>500개 미만</option>
        </select>
        <select className={styles.select} value={productFilter.option} onChange={(e)=>setProductFilter('option', e.target.value)}>
          <option value={''}>옵션 유무</option>
          <option value={true}>유</option>
          <option value={false}>무</option>
        </select> 
      </div>
    )
  }

  function saleStatus(){
    return(
      <div style={{ display: 'flex', gap: '0.5em' }}>
      <div>
        {Object.keys(productFilter.state).map((checkbox) => (
          <label key={checkbox} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name={checkbox}
              checked={productFilter.state[checkbox]}
              onChange={(e) => {
                if(checkbox === '전체')
                  handleAllCheckboxChange();
                else 
                  handleCheckboxChange(checkbox);
              }}
            />
            {checkbox}
          </label>
        ))}
      </div>
    </div>
    )
  }


  function searchWord(){
    return (
      <div style={{display: 'flex', gap: '1em'}}>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품명을 입력해주세요' value={productFilter.title} onChange={(e)=>setProductFilter('title', e.target.value)}/>
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='브랜드명을 입력해주세요' value={productFilter.brand} onChange={(e)=>setProductFilter('brand', e.target.value)}/>
        </div>
        <div className={styles.searchFilterList}>
          <input className={styles.input} type='text' placeholder='상품번호를 입력해주세요' value={productFilter.productId} onChange={(e)=>setProductFilter('productId', e.target.value)}/>
        </div>
      </div>
    )
  }

  const filterList = [
    { label : '검색어', content : searchWord()},
    { label : '판매상태', content : saleStatus()},
    { label : '카테고리', content : categoryFilter()},
    { label : '기간', content : dateFilter()},
    { label : '상세검색', content : detailSearch()},
  ]
  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
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
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input className={styles.button} type='submit' value='검색' onClick={()=>handleSearch()}/>
          <input className={styles.button} type='reset' onClick={()=>resetProductFilter()}/>
        </div>
      </form>
    </div>
  )
}


