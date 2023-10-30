import styles from './AdminSoldList.module.css';
import { AdminHeader } from './AdminHeader';
import { AdminMenuData } from './AdminMenuData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { AdminSoldFilter } from './AdminSoldFilter';
import AdminSoldModal from './AdminSoldModal';
export function AdminSoldList(props){
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const filteredOrderData = props.orderData && props.orderData.filter((item) => item.orderState === 1);
    
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
      <div className={styles.sectionSeperate}>
        <AdminMenuData/>
        <main className={styles.main}>
          <AdminSoldFilter/>
          <div className={styles.tableLocation}>
            <div className={styles.listContainer}>
              <h4>목록</h4>
              <div style={{display: 'flex', gap:'1em'}}>
                <select>
                  <option>내림차순</option>
                  <option>오름차순</option>
                </select>
                <select>
                  <option>50개씩 보기</option>
                  <option>100개씩 보기</option>
                </select>
              </div>
            </div>
            <div className={styles.manageBox}>
              <button className={styles.button}>발주확인</button>
              <button className={styles.button}>발송처리</button>
              <button className={styles.button}>취소처리</button>
            </div>
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
                  <th style={{width:'10%', fontWeight: '650'}}>주문자 정보</th>
                </tr>
              </thead>
              <tbody>
                {props.orderData 
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
                      onClick={()=>setModal(!modal)}>
                      보기
                    </td>
                  </tr>
                  {modal && <AdminSoldModal setModal={setModal} item={item}/>}
                  </React.Fragment>
                  ))
                : <tr><td>로딩중</td></tr>
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
        </main>
      </div>
    </div>
  )
}
