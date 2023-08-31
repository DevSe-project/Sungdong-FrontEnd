import styles from './TabInfo.module.css'
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
export function TabInfo(props){
  //Modal State 변수
  const [selectRelatedData, setSelectRelatedData] = useState(null);

  const navigate = useNavigate();

  // 상품정보 데이터
  const productInfo = [
    {label: '상품번호', value: props.detailData.id},
    {label: '브랜드', value: props.detailData.brand},
    {label: '원산지', value: props.detailData.madeIn},
    {label: '상품상태', value: props.detailData.new ? '새 상품' : '중고 상품'},
  ]

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return props.data.slice(startIndex, startIndex + 5);
  };
  
  // 아이템 클릭 핸들러
  const handleItemClick = (itemId) => {
    if (selectRelatedData === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectRelatedData(null);
    } else {
      setSelectRelatedData(itemId);
    }
  };

  const returnInfo = [
    {label: '택배사', value: 'CJ대한통운'},
    {label: '반품 배송비', value: '편도 3,000원(최초 배송비 무료인 경우 6,000원 부과)'},
    {label: '보내실 곳', value: '울산광역시 남구 산업로440번길 8 (주)성동물산  (우 : 44781)'},
    {label: '반품/교환 요청 가능 기간', value: '구매자 단순 변심은 상품 구매 후 7일 이내(구매자 반품 배송비 부담)'},
    {label: '반품/교환 불가능 사유', value: '1. 반품요청기간이 지난 경우'},
  ]

  //수량
  const [count, setCount] = useState("");

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);


    // 전체 선택 체크박스 클릭 시 호출되는 함수
    function handleSelectAllChange() {
      setSelectAll(!selectAll);
  
      if (!selectAll) {
        const allId = props.data.map((item) => item);
        setSelectedItems(allId);
      } else {
        setSelectedItems([]);
      }
    };
  
    // 체크박스 클릭 시 호출되는 함수
    function checkedBox(productId) {
      if (selectedItems.includes(productId)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
        setSelectedItems(selectedItems.filter((item) => item !== productId)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
        setSelectAll(false);
      } else {
        setSelectedItems([...selectedItems, productId]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
        if(selectedItems.length + 1 === props.data.length){
          setSelectAll(true);
        }
      }
    };

  //수량 최대입력 글자(제한 길이 변수)
  const maxLengthCheck = (e) => { 
    const lengthTarget = e.target.value; 
    //target.value.length = input에서 받은 value의 길이 
    //target.maxLength = 제한 길이

    if ( lengthTarget >= 0 && lengthTarget.length <= 3) { 
        setCount(lengthTarget); 
    } 
}

  //옵션 선택 state
  const [optionSelected, setOptionSelected] = useState(null);
  
  return(
    <div className={styles.tabInnerHeader}>

    {/* 탭 상품 정보 */}
    <h5 style={{fontWeight: '650'}}>상품 정보</h5>
    <div className={styles.productDetail}>
      {productInfo.map((item, index) =>
      <div key={index} className={styles.productDetailInner}>
        <div className={styles.productDetail_label}>
          <p>{item.label}</p>
        </div>
        <div className={styles.productDetail_content}>
          {item.value}
        </div>
      </div>
      )}
    </div>


    {/* 탭 상품 설명 */}
    <div id='1' className="tab-content">
      <div className={styles.reviewHeader}>
      <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>상품 설명</h3>
        <p>
        상품정보 내용임<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        </p>
      </div>
    </div>

        {/* 반품 / 교환 정보 */}
    <div id='2' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>반품 / 교환정보</h3>
        <p>반품 시 반품사유, 택배사, 배송비, 반품지 주소를 협의 후 반품상품 발송 바랍니다.</p>
      </div>
      <div className={styles.form}>
        {returnInfo.map((item, key) => 
        <div key={key} className={styles.formInner}>
          <div className={styles.label}>
            <p>{item.label}</p>
          </div>
          <div className={styles.content}>
            <p>{item.value}</p>
          </div>
        </div>
        )}
      </div>
    </div>


    {/* 탭 관련상품 */}
    <div id='3' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>관련 상품</h3>
        <div className={styles.qnATop}>
          <p>해당 상품과 관련된 상품입니다.</p>
        </div>
      </div>
      <table className={styles.table}>
        <thead 
        style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
        >
          <tr>
            <th>이미지</th>
            <th>상품코드</th>
            <th className={styles.title}>상품명</th>
            <th>단위</th>
            <th>가격</th>
            <th>
              <input 
                type='checkbox'
                checked={selectAll}
                onChange={()=>handleSelectAllChange()}/>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data 
          ? getCurrentPagePosts().map((item, index)=> (
          <React.Fragment key={index}>
            <tr className={styles.list}>
              <td>{item.image}</td>
              <td>{item.id}</td>
              <td className={styles.titleTd} onClick={()=>handleItemClick(item.id)}>
                <h5>{item.title}</h5>
              </td>
              <td>EA</td>
              <td>{item.price}</td>
              <td>
                <input 
                  checked={selectedItems.includes(item)}
                  onChange={() => checkedBox(item)}
                  type='checkbox'
                />   
              </td>
            </tr>
            {/* 모달 */}
            {selectRelatedData === item.id && (
            <tr>
              <td colSpan="6">
                <table className={styles.colTable}>
                  <thead style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                    <tr>
                      <th>
                        브랜드
                      </th>
                      <th>
                        옵션
                      </th>
                      <th>
                        개수
                      </th>
                      <th>
                        총 가격
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{width: '25%'}}>
                        {item.brand}
                      </td>
                      <td style={{width: '45%'}}>
                        {item.option 
                        ?                   
                        <div style={{display: 'flex', alignItems:'center', gap:'0.5em'}}>
                          옵션 :
                          <select 
                          value={optionSelected || ""}
                          onChange={(e)=>{setOptionSelected(e.target.value)}}
                          className={styles.selectSize}
                          >
                            <option value="" disabled>옵션 선택</option>
                            {item.option.map((item, index) =>
                            <option key={index} value={item.value}>{item.value}</option>
                            )}
                          </select>
                        </div>  : '없음'}
                      </td>
                      <td style={{width: '15%'}}>
                        <input style={{width: '50%'}} value={count} className={styles.input} onChange={maxLengthCheck} type='number' placeholder='숫자만 입력'/>
                      </td>
                      <td>
                        {item.price * count}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            )}
            </React.Fragment>
            ))
          : <tr><td>관련된 상품이 없습니다.</td></tr>
          }
        </tbody>
      </table>
      <div className={styles.buttonContainer}>
        {/* 이전 페이지 */}
        <button
        className={styles.button} 
        onClick={()=> {
          if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
          } else {
            alert("해당 페이지가 가장 첫 페이지 입니다.")
          }}}>
            <i className="far fa-angle-left"/>
        </button>
        <div className={styles.button}>
          {currentPage}
        </div>
        {/* 다음 페이지 */}
        <button
        className={styles.button}
        onClick={()=> {
          if(props.data.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
    </div>
  </div>
  )
}