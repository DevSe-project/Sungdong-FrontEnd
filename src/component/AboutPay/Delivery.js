import { useNavigate } from 'react-router-dom'
import styles from './Delivery.module.css'
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
export function Delivery(props){
  //로그인 정보 불러오기
  const inLogin = props.decryptData(JSON.parse(sessionStorage.getItem('saveLoginData')));
  const filterOrderData = props.orderData && props.orderData.filter((item)=>item.userId === inLogin.id);
  const [filterSearch, setFilterSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  // 암호화와 복호화 키
  const encryptionKey = 'bigdev2023!';

  useEffect(()=>{
    if(props.resultSearch){
      setFilterSearch(props.resultSearch)
    }
  },[props.resultSearch])

  useEffect(() => {
    if(filterOrderData){
      if (filterSearch !== "") {
        // 데이터에서 타이틀과 검색결과를 찾고
        const filtered = filterOrderData.filter((item) =>
          item.productName.includes(filterSearch))
        // 목록 밑작업 해줌
        const addCntList = filtered.map((item, index) => ({
          ...item,
          cnt: item.cnt ? item.cnt : 1,
          finprice: item.finprice ? item.finprice : item.price,
          listId: index,
        }));
        // 필터링 된 아이템 표시
        setFilteredItems(addCntList);
      }
    }
  }, [filterSearch])

  const navigate = useNavigate();
  function detailOrder(item){
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(item), encryptionKey).toString();
    sessionStorage.setItem('newOrderData', JSON.stringify(encryptedData));
    navigate('/orderDetail');
  }

  function handleDeliveryAPI(item, deliveryNum){
    if(item.orderState === 3){
      switch(item.delivery.deliveryType){
        case '일반택배':
          window.open(`https://tracker.delivery/#/kr.cjlogistics/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        case '화물':
          window.open(`https://tracker.delivery/#/${item.delivery.deliverySelect}/${deliveryNum}`, '_blank', 'width=600,height=800');
          break;
        default : 
          alert("직접 수령이나 성동 택배는 조회하실 수 없습니다.");
          break;
      } 
    } else {
      alert("배송 준비 중일때는 조회하실 수 없습니다.")
    }
  }
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return filteredItems.length > 0 
    ? filteredItems.slice(startIndex, startIndex + 5) 
    : props.orderData && filterOrderData.slice(startIndex, startIndex + 5)
  };


  return(
    <div className={styles.container}>
      {props.resultSearch &&
      <h3 style={{margin: '1em'}}>
      "{props.resultSearch}" 에 대해
      <span style={{color: '#CC0000', fontWeight: '650', margin: '0.5em'}}>{filteredItems.length}건</span>
      이 검색 되었습니다.
      </h3>}
      {props.orderData ?
      getCurrentPagePosts().map((item, key)=> 
      <div key={key} className={styles.deliveryList}>
        <div className={styles.orderDate}>
          <h4>{item.date} 주문</h4>
          <div onClick={()=>detailOrder(item)} className={styles.orderDetail}>
            <span style={{fontWeight: '450'}}>주문 상세보기</span> 
            <i className="far fa-chevron-right"></i>
          </div>
        </div>
        <div className={styles.deliveryStyle}>
          <div className={styles.deliveryNow}>
            <div className={styles.deliveryNowMenu}>
              <h5>{item.delivery.deliveryDate 
              ? `배송 예정 : ${item.delivery.deliveryDate}`
              : item.orderState === 0 ? '결제 대기' 
              : item.orderState === 1 ? '결제 완료'
              : item.orderState === 2 ? '배송 준비중'
              : item.orderState === 3 ? '배송 중'
              : item.orderState === 4 ? '배송 완료' 
              : '누락된 상품(고객센터 문의)' }</h5>
              <i style={{color: '#ccc'}} className="fas fa-trash-alt"></i>
            </div>
            <div className={styles.deliveryNowItem}>
              <img className={styles.img} src={item.image.mini} alt="주문상품"/>
              <div className={styles.deliveryNowInformation}>
                <span style={{fontWeight: '650'}}>{item.productName}{item.optionSelected && `(${item.optionSelected})`}, {item.cnt}개 </span>
                <span style={{fontWeight: '650'}}>{item.discount 
                ? (item.finprice - item.finprice/100*item.discount).toLocaleString()
                : item.finprice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          <div className={styles.deliveryMenu}>
            <button 
          onClick={() => {
            handleDeliveryAPI(item, 111111111111)
          }}
            className={styles.button}>배송 조회</button>
            <button className={styles.button}>교환, 반품 신청</button>
          </div>
        </div>
      </div>
      )
    : 
    // 스켈레톤 처리
    <div className={styles.colskeleton}>
      <div className={styles.frameskeleton}>
      &nbsp;
      </div>
      <div className={styles.nameskeleton}>
        &nbsp;
      </div>
      <div className={styles.priceskeleton}>
      &nbsp;
      </div>
    </div>
    }
    <div className={styles.buttonContainer}>
      {/* 이전 페이지 */}
      <button
        className={styles.pageButton} 
        onClick={()=> {
          if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
          } else {
            alert("해당 페이지가 가장 첫 페이지 입니다.")
      }}}>
      <i className="far fa-angle-left"/>
      </button>
      <div className={styles.pageButton}>
        {currentPage}
      </div>
        {/* 다음 페이지 */}
      <button
      className={styles.pageButton}
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