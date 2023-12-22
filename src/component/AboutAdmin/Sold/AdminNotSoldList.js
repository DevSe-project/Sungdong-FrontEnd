import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import styles from './AdminNotSoldList.module.css';
import React, { useState } from 'react';
import AdminSoldModal from './AdminSoldModal';
import { useNavigate } from 'react-router-dom';
export function AdminNotSoldList(props){
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  //모달 창 생성 state
  const [modal, setModal] = useState(false);

  //State가 0인 주문 데이터들만 필터링.
  const filteredOrderData = props.orderData && props.orderData.filter((item) => item.orderState === 0);
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return filteredItems.length > 0 
    ? filteredItems.slice(startIndex, startIndex + 5)
    : props.orderData && filteredOrderData.slice(startIndex, startIndex + 5);
  };
  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <div className={styles.container}>
          {/* 리스트 출력 */}
          <div className={styles.bodyHeader}>
            <h1>미결제 주문 관리</h1>
          </div>
          <div className={styles.tableLocation}>
            <table className={styles.table}>
              <thead 
              style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
              >
                <tr>
                  <th><input type='checkbox'/></th>
                  <th>이미지</th>
                  <th style={{width:'10%'}}>상품코드</th>
                  <th style={{width:'10%'}}>주문번호</th>
                  <th style={{width:'10%'}}>상품명</th>
                  <th style={{width:'10%'}}>옵션</th>
                  <th style={{width:'10%'}}>주문량</th>
                  <th style={{width:'10%'}}>공급가</th>
                  <th style={{width:'10%', fontWeight: '650'}}>주문가</th>
                  <th style={{width:'13%', fontWeight: '650'}}>주문자 정보</th>
                </tr>
              </thead>
              <tbody>
                {props.orderData 
                ? filteredOrderData.length > 0
                ? getCurrentPagePosts().map((item, index)=> (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td><input type="checkbox" name="list"/></td>
                    <td><img src={item.image.mini} alt='이미지'></img></td>
                    <td>{item.productId}</td>
                    <td>
                      {item.orderId}
                    </td>
                    <td>
                      <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.productName}</h5>
                    </td>
                    <td>{item.optionSelected}</td>
                    <td>{item.cnt}</td>
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
                      >
                      보기
                    </td>
                  </tr>
                  {/* 모달 State가 true일때 생성됨 */}
                  {modal && <AdminSoldModal setModal={setModal} item={item}/>}
                  </React.Fragment>
                  ))
                : <tr><td colSpan="10">불러들일 데이터가 없습니다.</td></tr>
                : <tr><td colSpan="10">로딩중</td></tr>
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
                if(filteredItems.length > 5){
                  setCurrentPage(currentPage + 1)
                } else {
                  alert("다음 페이지가 없습니다.")
                }}}>
                  <i className="far fa-angle-right"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}