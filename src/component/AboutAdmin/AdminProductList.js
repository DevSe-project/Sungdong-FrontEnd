import { useState } from 'react';
import { AdminHeader } from './AdminHeader'
import { AdminMenuData } from './AdminMenuData'
import React from 'react';
import styles from './AdminProductList.module.css'
import { useNavigate } from 'react-router-dom';
import { AdminSideBar } from './AdminSideBar';
export function AdminProductList(props){
  
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  //Td 선택시 Modal State 변수
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();


  // 아이템 클릭 핸들러
  const handleItemClick = (itemId) => {
    if (selectedData === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectedData(null);
    } else {
      setSelectedData(itemId);
    }
  };
    
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return filteredItems.length > 0 
    ? filteredItems.slice(startIndex, startIndex + 5) 
    : props.data.slice(startIndex, startIndex + 5);
  };
  return(
    <div>
      <AdminHeader/>
      <div className={styles.body}>
        <AdminMenuData/>
        <div>
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
                  <th style={{fontWeight: '650'}}>공급가</th>
                  <th>더보기</th>
                </tr>
              </thead>
              <tbody>
                {props.data 
                ? getCurrentPagePosts().map((item, index)=> (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><img src={item.image.mini} alt='이미지'></img></td>
                    <td>{item.id}</td>
                    <td 
                      className={styles.detailView}
                      onClick={()=>navigate(`/detail/${item.id}`)}>
                      상세보기
                    </td>
                    <td className={styles.detailView} onClick={()=>handleItemClick(item.id)}>
                      <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.title}</h5>
                    </td>
                    <td>EA</td>
                    <td>\{item.price.toLocaleString()}</td>
                    <td style={{fontWeight: '750'}}>
                      {item.finprice
                      ? item.discount
                      ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                      : `\\${item.finprice.toLocaleString()}`
                      : `\\${item.price.toLocaleString()}`}
                    </td>
                    <td 
                      className={styles.detailView}
                      onClick={()=>handleItemClick(item.id)}>
                      더보기&nbsp;{selectedData === item.id  
                      ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                      : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;
                    </td>
                  </tr>
                  {/* 모달 */}
                  {selectedData === item.id && (
                  <tr>
                    <td colSpan="8">
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
                              재고
                            </th>
                            <th style={{width: '10%'}}>
                              적용률
                            </th>
                            <th style={{width: '10%'}}>
                              할인금액
                            </th>
                            <th style={{width: '10%', fontWeight: '650'}}>
                              공급가
                            </th>
                            <th>
                              <button className={styles.button}>삭제</button>
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
                              <span>옵션있음</span>
                              :
                              <span>옵션없음</span>
                              }
                            </td>
                            <td>
                              {item.supply}
                            </td>
                            <td>
                              {item.discount}%
                            </td>
                            <td style={{fontWeight: '750'}}>
                              {item.discount
                              ? `\\${(((item.price/100)*item.discount)*item.cnt).toLocaleString()}`
                              : 0}
                            </td>
                            <td style={{fontWeight: '750'}}>
                            {item.finprice
                            ? item.discount
                            ? `\\${ (item.finprice - (((item.price/100)*item.discount)*item.cnt)).toLocaleString()}`
                            : `\\${item.finprice.toLocaleString()}`
                            : `\\${item.price.toLocaleString()}`}
                            </td>
                            <td>
                              <button className={styles.button}>수정</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
      
                  )}
                  </React.Fragment>
                  ))
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
        <AdminSideBar/>
      </div>
    </div>
  )
}