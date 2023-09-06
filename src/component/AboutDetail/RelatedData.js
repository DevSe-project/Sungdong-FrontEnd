import { useEffect, useState } from 'react';
import styles from './RelatedData.module.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';
export function RelatedData(props) {

  const navigate = useNavigate();

  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);

  //수량
  const [count, setCount] = useState(1);

  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  // 관련상품 리스트 
  const [relatedList, setRelatedList] = useState([]);

  //Td 선택시 Modal State 변수
  const [selectRelatedData, setSelectRelatedData] = useState(null);

  //수정하기 state
  const [editStatus, setEditStatus] = useState(relatedList.map(()=>false));

  //옵션 선택 state
  const [optionSelected, setOptionSelected] = useState(relatedList.map(() => ""));


  // relatedList 데이터 삽입
  useEffect(() => {
    if (props.data && props.detailData) {
      const filterList = props.data.filter((item) =>
      item.category.main === props.detailData.category.main);
      const addCntList = filterList.map((item,index) => ({
        ...item,
        cnt: item.cnt ? item.cnt : 1,
        finprice : item.finprice ? item.finprice : item.price,
        listId : index,
      }));
      setRelatedList(addCntList);
    }
  }, [props.data, props.detailData]);

  // 아이템 클릭 핸들러
  const handleItemClick = (itemId) => {
    if (selectRelatedData === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectRelatedData(null);
    } else {
      setSelectRelatedData(itemId);
    }
  };
  

  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return relatedList.slice(startIndex, startIndex + 5);
  };
  
    // 체크박스 클릭 시 호출되는 함수
    function checkedBox(product) {
      if (selectedItems.includes(product)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
        setSelectedItems(selectedItems.filter((item) => item !== product)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
        setSelectAll(false);
      } else {
        setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
        if(selectedItems.length + 1 === relatedList.length){
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

  //수정하기 버튼을 눌렀을 때 함수 작동(개수 세는 함수)
  function editItem(index){
    const newEditStatus = [...editStatus]; 
    newEditStatus[index] = true;
    setEditStatus(newEditStatus);
    setCount(relatedList[index].cnt); 
  }

  //수정완료 버튼 눌렀을 때 함수 작동(개수 저장 함수)
  function updatedItem(index){
    if(count > 0) {
      relatedList[index].cnt = count;
      relatedList[index].finprice = relatedList[index].price * count;
      const newEditStatus = [...editStatus]; 
      newEditStatus[index] = false;
      setEditStatus(newEditStatus);
    } else {
      alert("수량은 0보다 커야합니다.")
    }
  }

  // 장바구니 담기 함수
  function basketRelatedData() {
    // 유효성 체크
    if(!props.login){
      alert("로그인 후 이용가능한 서비스입니다.")
      navigate("/login");
      return;
    }

    if (selectedItems.length === 0) {
      alert("먼저 담을 상품을 체크해주세요!");
      return;
    }
  
    if (count <= 0) {
      alert("수량은 0보다 커야합니다.");
      return;
    }
  
    const isEditStatus = selectedItems.some((item, index) => editStatus[index]);
    if (isEditStatus) {
      alert("수정완료 버튼을 누르고 장바구니에 담아주세요.")
      return;
    }

  
    if (selectedItems.some((item) => 
    item.option && (optionSelected[item.listId] === undefined || optionSelected.length === 0))) {
    alert("필수 옵션을 선택해주세요!");
    return;
}
  
    // 중복확인
    const selectedItemsInfo = selectedItems.map((item) => ({
      id: item.id,
      option: optionSelected[item.listId],
    }));
  
    const isDuplicate = selectedItemsInfo.some((selectedItemsInfo) =>
      props.basketList.some((basketItem) =>
        basketItem.id === selectedItemsInfo.id &&
        basketItem.optionSelected === selectedItemsInfo.option
      )
    );
  
    if (isDuplicate) {
      const findDuplicate = props.basketList.filter((item) =>
        selectedItemsInfo.some((selectedItemInfo) =>
          item.id === selectedItemInfo.id &&
          item.optionSelected === selectedItemInfo.option
        )
      );
  
      const duplicateTitles = findDuplicate.map((item) => item.title).join(", ");
      alert(`이미 장바구니에 추가된 상품이 있습니다. 
        (중복된 상품 : ${duplicateTitles})`);
      return;
    }
  
    // 옵션 선택한 경우에만 option 객체로 추가
    const basketProductsToAdd = selectedItems.map((item) => {
      if (item.option && optionSelected[item.listId] !== undefined) {
        return { ...item, optionSelected: optionSelected[item.listId] };
      }
      return item;
    });
  
    props.setBasketList([...props.basketList, ...basketProductsToAdd]);
  
    alert("해당 상품이 장바구니에 추가되었습니다.");
    setSelectedItems([]);
  }
  
  function optionChange(e, index) {
    const newOptionSelected = [...optionSelected];
    newOptionSelected[index] = e.target.value;
    setOptionSelected(newOptionSelected);
  }

  return(
    <div>
      <div className={styles.buttonBox}>
        <button className={styles.button} onClick={()=> navigate("/basket")}>
          장바구니 이동
      </button>
        <button className={styles.button} onClick={()=> basketRelatedData()}>
          선택 항목 장바구니 추가
        </button>
      </div>
      <div className={styles.tableLocation}>
        <table className={styles.table}>
          <thead 
          style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
          >
            <tr>
              <th>이미지</th>
              <th>상품코드</th>
              <th>상세보기</th>
              <th>상품명</th>
              <th>단위</th>
              <th>표준가</th>
              <th>더보기</th>
            </tr>
          </thead>
          <tbody>
            {props.data 
            ? relatedList.length > 0
            ? getCurrentPagePosts().map((item, index)=> (
            <React.Fragment key={index}>
              <tr className={styles.list}>
                <td>{item.image}</td>
                <td>{item.id}</td>
                <td 
                  className={styles.detailView}
                  onClick={()=>navigate(`/detail/${item.id}`)}>
                  상세보기
                </td>
                <td className={styles.titleTd} onClick={()=>handleItemClick(item.id)}>
                  <h5>{item.title}</h5>
                </td>
                <td>EA</td>
                <td>{item.price}</td>
                <td 
                  className={styles.detailView}
                  onClick={()=>handleItemClick(item.id)}>
                  [ 더보기&nbsp;{selectRelatedData === item.id  
                  ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                  : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;]
                </td>
              </tr>
              {/* 모달 */}
              {selectRelatedData === item.id && (
              <tr>
                <td colSpan="7">
                  <table className={styles.colTable}>
                    <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                      <tr>
                        <th style={{width: '15%'}}>
                          브랜드
                        </th>
                        <th style={{width: '12%'}}>
                          옵션
                        </th>
                        <th style={{width: '15%'}}>
                          개수
                        </th>
                        <th style={{width: '12%'}}>
                          적용률
                        </th>
                        <th style={{width: '12%'}}>
                          적용가
                        </th>
                        <th style={{width: '12%'}}>
                          공급가
                        </th>
                        <th style={{width: '30%'}}>
                          <button className={styles.button} onClick={()=> basketRelatedData()}>장바구니 추가</button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {item.brand}
                        </td>
                        <td>
                          {item.option 
                          ?                   
                          <div style={{ width: '100%', display: 'flex', alignItems:'center', textAlign: 'center', justifyContent: 'center'}}>
                            <select 
                            value={optionSelected[index] || ""}
                            onChange={(e)=>{optionChange(e, index)}}
                            className={styles.selectSize}
                            >
                              <option value="" disabled>옵션 선택</option>
                              {item.option.map((item, index) =>
                              <option key={index} value={item.value}>{item.value}</option>
                              )}
                            </select>
                          </div>  : '없음'}
                        </td>
                        <td>
                        {!editStatus[index]
                        ? item.cnt
                        : <input value={count} className={styles.input} onChange={maxLengthCheck} minLength={1} maxLength={3} min={0} max={999} type='number' placeholder='숫자만 입력'/> }
                        <br/>
  
                        {!editStatus[index] 
                        ? <button
                          onClick={()=>{editItem(index)}} 
                          className={styles.editButton}
                          >개수 수정
                          </button> 
                        : <button 
                          className={styles.editButton}
                          onClick={()=>updatedItem(index)}
                          >수정 완료
                          </button>
                        }
                        </td>
                        <td>
                          {item.discount}%
                        </td>
                        <td>
                          {item.discount
                          ? `\\${((item.price/100)*item.discount)*item.cnt}`
                          : 0}
                        </td>
                        <td>
                        {item.finprice
                        ? item.discount
                        ? `\\${ item.finprice - (((item.price/100)*item.discount)*item.cnt)}`
                        : `\\${item.finprice}`
                        : item.price}
                        </td>
                        <td>
                          <input 
                            checked={selectedItems.includes(item)}
                            onChange={() => checkedBox(item)}
                            type='checkbox'
                          />   
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
  
              )}
              </React.Fragment>
              ))
            : <tr><td>해당하는 상품과 관련된 상품이 존재하지 않습니다.</td></tr>
            : <tr><td>로딩중</td></tr>
            }
          </tbody>
        </table>
      </div>
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
          if(relatedList.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
  </div>
  )
}