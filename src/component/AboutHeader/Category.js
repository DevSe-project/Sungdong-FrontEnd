import { useEffect, useState } from "react";
import { TopBanner } from "./TopBanner";
import { useNavigate } from "react-router-dom";
import styles from './Category.module.css'
import React from 'react';
export function Category(props){
    // 카테고리
    const [selectedCategory, setSelectedCategory] = useState('전체'); //메인 카테고리
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); //서브 카테고리

    
    // 필터된 항목을 저장할 상태 변수
    const [filteredItems, setFilteredItems] = useState([]);

    const mainCategory = JSON.parse(sessionStorage.getItem('category'));
    const subCategory = JSON.parse(sessionStorage.getItem('subCategory'));

    // mainCategory와 subCategory가 바뀔 때 마다 실행
    useEffect(() => {
      setSelectedCategory(mainCategory);
      setSelectedSubCategory(subCategory);
    }, [mainCategory, subCategory]);


    // // 선택된 카테고리 변경 핸들러
    // const handleCategoryChange = (category) => {
    //   setSelectedCategory(category);
    // };
    // const handleSubCategoryChange = (category) => {
    //   setSelectedSubCategory(category);
    // };
    // 카테고리에 따라 아이템 필터링

    useEffect(() => {
      if(props.data){
        if (selectedCategory === '전체' && selectedSubCategory === null) {
          const addCntList = props.data.map((item,index) => ({
            ...item,
            cnt: item.cnt ? item.cnt : 1,
            finprice : item.finprice ? item.finprice : item.price,
            listId : index,
          }));
          setFilteredItems(addCntList);
        } else {
          if(selectedSubCategory !== null){
            const filtered = props.data.filter((item) => item.category.sub === selectedSubCategory);
            const addCntList = filtered.map((item,index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice : item.finprice ? item.finprice : item.price,
              listId : index,
            }));
            setFilteredItems(addCntList);
          } else if(selectedSubCategory === null){
            const filtered = props.data.filter((item) => item.category.main === selectedCategory);
            const addCntList = filtered.map((item,index) => ({
              ...item,
              cnt: item.cnt ? item.cnt : 1,
              finprice : item.finprice ? item.finprice : item.price,
              listId : index,
            }));
            setFilteredItems(addCntList);
          }
        }
      }
    }, [props.data]);

    const navigate = useNavigate();

    // 게시물 데이터와 페이지 번호 상태 관리    
    const [currentPage, setCurrentPage] = useState(1);
  
    //수량
    const [count, setCount] = useState(1);
  
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);
  
    //Td 선택시 Modal State 변수
    const [selectedData, setSelectedData] = useState(null);
  
    //수정하기 state
    const [editStatus, setEditStatus] = useState(filteredItems.map(()=>false));
  
    //옵션 선택 state
    const [optionSelected, setOptionSelected] = useState(filteredItems.map(() => ""));
  
  
    // 아이템 클릭 핸들러
    const handleItemClick = (itemId) => {
      if (selectedData === itemId) {
        // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
        setSelectedData(null);
      } else {
        setSelectedData(itemId);
      }
    };
    
  
    // 현재 페이지에 해당하는 게시물 목록 가져오기
    const getCurrentPagePosts = () => {
      const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
      return filteredItems.slice(startIndex, startIndex + 5);
    };
    
      // 체크박스 클릭 시 호출되는 함수
      function checkedBox(product) {
        if (selectedItems.includes(product)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
          setSelectedItems(selectedItems.filter((item) => item !== product)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
        } else {
          setSelectedItems([...selectedItems, product]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
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
      setCount(filteredItems[index].cnt); 
    }
  
    //수정완료 버튼 눌렀을 때 함수 작동(개수 저장 함수)
    function updatedItem(index){
      if(count > 0) {
        filteredItems[index].cnt = count;
        filteredItems[index].finprice = filteredItems[index].price * count;
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
      <TopBanner categoryData={props.categoryData} setCategoryData={props.setCategoryData} 
      login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} 
      iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} 
      icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} 
      category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
        <div className={styles.topTitle}>
          <h1>카테고리</h1>
        </div>
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
              ? filteredItems.length > 0
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
                    [ 더보기&nbsp;{selectedData === item.id  
                    ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                    : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;]
                  </td>
                </tr>
                {/* 모달 */}
                {selectedData === item.id && (
                <tr>
                  <td colSpan="7">
                    <table className={styles.colTable}>
                      <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                        <tr>
                          <th style={{width: '25%'}}>
                            브랜드
                          </th>
                          <th style={{width: '10%'}}>
                            옵션
                          </th>
                          <th style={{width: '20%'}}>
                            개수
                          </th>
                          <th style={{width: '10%'}}>
                            적용률
                          </th>
                          <th style={{width: '10%'}}>
                            적용가
                          </th>
                          <th style={{width: '10%'}}>
                            공급가
                          </th>
                          <th style={{width: '20%'}}>
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
            if(filteredItems.length > 5){
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