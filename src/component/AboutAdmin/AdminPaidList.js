import styles from './AdminPaidList.module.css';
import { AdminHeader } from './AdminHeader';
import { AdminMenuData } from './AdminMenuData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
import { AdminPaidFilter } from './AdminPaidFilter';
export function AdminPaidList(props){
  // 필터된 항목을 저장할 상태 변수
  const [filteredItems, setFilteredItems] = useState([]);

  //Td 선택시 Modal State 변수
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();

  const filteredOrderData = props.orderData && props.orderData.filter((item) => item.orderState === 1);

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
    : props.orderData && filteredOrderData.slice(startIndex, startIndex + 5);
  };
  return(
    <div>
      <AdminHeader/>
      <div className={styles.sectionSeperate}>
        <AdminMenuData/>
        <main className={styles.main}>
          <AdminPaidFilter/>
          <div className={styles.tableLocation}>
            <table className={styles.table}>
              <thead 
              style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
              >
                <tr>
                  <th><input type='checkbox'/></th>
                  <th>이미지</th>
                  <th>상품코드</th>
                  <th>주문번호</th>
                  <th>상품명</th>
                  <th>주문량</th>
                  <th>공급가</th>
                  <th style={{fontWeight: '650'}}>주문가</th>
                  <th>더보기</th>
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
                    <td className={styles.detailView} onClick={()=>handleItemClick(item.id)}>
                      <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{item.productName}</h5>
                    </td>
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
                      onClick={()=>handleItemClick(item.id)}>
                      더보기&nbsp;{selectedData === item.id  
                      ? <i className="fa-sharp fa-solid fa-caret-up"></i>
                      : <i className="fa-sharp fa-solid fa-caret-down"></i>}&nbsp;
                    </td>
                  </tr>
                  {/* 모달 */}
                  {selectedData === item.id && (
                  <tr>
                    <td colSpan="9">
                      <table className={styles.colTable}>
                        <thead style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'}}>
                          <tr>
                            <th style={{width: '10%'}}>
                              배송 속성
                            </th>
                            <th style={{width: '10%'}}>
                              배송사
                            </th>
                            <th style={{width: '15%'}}>
                              배송 희망일
                            </th>
                            <th style={{width: '10%'}}>
                              옵션
                            </th>
                            <th style={{width: '15%'}}>
                              받을 배송지
                            </th>
                            <th style={{width: '10%'}}>
                              결제 방법
                            </th>
                            <th style={{width: '10%'}}>
                              증빙 서류
                            </th>
                            {item.order.moneyReceipt &&
                            <th style={{width: '10%'}}>
                              발급 방식
                            </th>
                            }
                            {
                              item.order.transAction === "명세서출력"
                              && 
                              <th style={{width: '10%'}}>
                                팩스
                              </th>
                            }
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {item.delivery.deliveryType}
                            </td>
                            <td>
                              {item.delivery.deliverySelect}
                            </td>
                            <td>
                              {item.delivery.deliveryDate
                              ? item.delivery.deliveryDate
                              : "없음"}
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
                            {
                            item.delivery.address 
                            ? item.delivery.address.address 
                            ? `${item.delivery.address.address.roadAddress} 
                            (${item.delivery.address.address.bname}, 
                              ${item.delivery.address.address.buildingName 
                            ? item.delivery.address.address.buildingName
                            : item.delivery.address.address.jibunAddress})
                            ${item.delivery.address.addressDetail}` 
                            : item.delivery.address.addressDetail
                            : null
                            }
                            </td>
                            <td>
                              {item.order.payRoute}
                            </td>
                            <td>
                              {item.order.moneyReceipt}
                            </td>
                            {
                            item.order.moneyReceipt 
                            &&
                            <td>
                              {item.order.transAction}
                            </td>
                            }
                            {
                              item.order.transAction === "명세서출력"
                              &&
                              <td>{item.order.fax}</td>
                            }
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
        </main>
      </div>
    </div>
  )
}