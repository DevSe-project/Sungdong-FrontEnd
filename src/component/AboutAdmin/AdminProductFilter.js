import styles from './AdminProductFilter.module.css'
export function AdminProductFilter(){
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
        <div className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset'/>
        </div>
      </form>
    </div>
  )
}

function searchWord(){
  return (
    <div style={{display: 'flex', gap: '1em'}}>
      <div className={styles.searchFilterList}>
        <input type='text' placeholder='상품명을 입력해주세요'/>
      </div>
      <div className={styles.searchFilterList}>
        <input type='text' placeholder='브랜드명을 입력해주세요'/>
      </div>
      <div className={styles.searchFilterList}>
        <input type='text' placeholder='상품번호를 입력해주세요'/>
      </div>
    </div>
  )
}

function saleStatus(){
  return(
    <div style={{display: 'flex', gap: '0.5em'}}>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>전체</label>
      </div>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>판매대기</label>
      </div>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>판매중</label>
      </div>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>품절</label>
      </div>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>판매중지</label>
      </div>
      <div>
        <label style={{display:'flex', alignItems:'center'}}><input type='checkbox' name='sale'/>판매종료</label>
      </div>
    </div>
  )
}

function categoryFilter(){
  return(
    <div style={{display: 'flex', gap: '0.5em'}}>
      <select>
        <option>대분류</option>
        <option></option>
      </select>
      <select>
        <option>중분류</option>
        <option></option>
      </select>
      <select>
        <option>소분류</option>
        <option></option>
      </select> 
    </div>
  )
}

function dateFilter(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <select>
        <option>상품 등록일</option>
        <option>판매 시작일</option>
        <option>판매 종료일</option>
        <option>최종 수정일</option>
      </select>
      <div>
        <input type='date'></input> 
        &nbsp;~&nbsp;
        <input type='date'></input>
      </div>
    </div>
  )
}

function detailSearch(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <select>
        <option>재고</option>
        <option></option>
      </select>
      <select>
        <option>배송 속성</option>
        <option></option>
      </select>
      <select>
        <option>배송사</option>
        <option></option>
      </select> 
      <select>
        <option>옵션 유무</option>
        <option></option>
      </select> 
    </div>
  )
}