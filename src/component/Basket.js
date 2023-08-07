import { useState } from 'react';
import styles from './Basket.module.css'
import { useNavigate } from 'react-router-dom';
import { TopBanner } from './TopBanner';
import { CategoryBar } from './CategoryBar';
export function Basket(props){
    const navigate = useNavigate();
    const [count, setCount] = useState("");
    const [editStatus, setEditStatus] = useState(false);
    // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
    const [selectedItems, setSelectedItems] = useState([]);

    // 전체 선택 체크박스 상태를 저장할 상태 변수
    const [selectAll, setSelectAll] = useState(false);
  
    // 전체 선택 체크박스 클릭 시 호출되는 함수
    function handleSelectAllChange() {
      setSelectAll(!selectAll);
  
      if (!selectAll) {
        const allId = props.orderList.map((item) => item.id);
        setSelectedItems(allId);
      } else {
        setSelectedItems([]);
      }
    };
  
    // 체크박스 클릭 시 호출되는 함수
    function checkedBox(productId) {
      if (selectedItems.includes(productId)) { //productID가 중복이면 true == 이미 체크박스가 클릭되어 있으면
        setSelectedItems(selectedItems.filter((id) => id !== productId)); //체크박스를 해제함 == 선택한 상품 저장 변수에서 제외
      } else {
        setSelectedItems([...selectedItems, productId]); //selectedItems의 배열과 productID 배열을 합쳐 다시 selectedItems에 저장
      }
    };
    const deletedList = () => {
      //props.wishlist 배열에서 selectedItems에 포함된(체크박스 선택된) 항목들이 아닌 것들로 새로운 배열을 생성
      if(selectedItems!==[]){
      const updatedWishlist = props.orderList.filter((item) => !selectedItems.includes(item.id)); 
      props.setOrderList(updatedWishlist);
  
      // 선택된 항목들 초기화
      setSelectedItems([]);
      
      //알림
      alert("찜 리스트에서 해당 품목이 성공적으로 삭제되었습니다.")
    } else {
      alert("선택된 항목이 없습니다.")
    }
  };
    //수량 최대입력 글자(제한 길이 변수)
    function maxLengthCheck(e) { 
      const target = e.target; 
      //target.value.length = input에서 받은 value의 길이 
      //target.maxLength = 제한 길이 
      setCount(target.value);
      if (target.value.length > target.maxLength) { 
          target.value = target.value.slice(0, target.maxLength); 
      } 
  }
    function editItem(index){
      setEditStatus(true);
      setCount(props.orderList[index].cnt); 
    }
    function updatedItem(index){
      props.orderList[index].cnt = count;
      props.orderList[index].finprice = props.orderList[index].price * count;
      setEditStatus(false);
    }
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <div className={styles.stepBar}>
        <div className={styles.stepOn}>
          <p>STEP 01</p>
          <h4>장바구니</h4>
        </div>
        <div className={styles.step}>
          <p>STEP 02</p>
          <h4>주문하기</h4>
        </div>
        <div className={styles.step}>
          <p>STEP 03</p>
          <h4>결제하기</h4>
        </div>
        <div className={styles.step}>
          <p>STEP 04</p>
          <h4>주문하기</h4>
        </div>
      </div>
      <div className={styles.body}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><input 
              type='checkbox'
              checked={selectAll}
              onChange={()=>handleSelectAllChange()}/></th>
              <th>상품 이미지</th>
              <th className={styles.name}>상품 정보</th>
              <th>수량</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
          {props.orderList ? props.orderList.map((item, index)=>(
            <tr>
              <td>
                <input 
                checked={selectedItems.includes(item.id)}
                onChange={() => checkedBox(item.id)}
                type='checkbox'
                />
              </td>
              <td><img src='../image/logo.jpeg' alt='이미지'/></td>
              <td>
                <h5 className={styles.link} onClick={()=>navigate(`/detail/${item.id}`)}>{item.title}</h5>
                <div>
                옵션 : 옵션정보
                <p>상품 금액 : <span className={styles.price}>\{item.price}</span></p>
                </div>
              </td>
              <td>{editStatus===false ? item.cnt : <input value={count} className={styles.input} onChange={(e)=>maxLengthCheck(e)} minLength={1} maxLength={3} min={0} max={999} type='number' placeholder='숫자만 입력'/> }
              <br/>
              {editStatus===false ? <button
              onClick={()=>{editItem(index)}} 
              className={styles.editButton}
              >주문 수정</button> : <button className={styles.editButton} onClick={()=>updatedItem(index)}>수정 완료</button>}
              </td>
              <td className={styles.price}>\{item.finprice}</td>
            </tr>
            ))
          : null}
          </tbody>
        </table>
        <div>
          <button className={styles.deletebutton} onClick={()=>deletedList()}>삭제</button>
          <button className={styles.button}>주문하기</button>
        </div>
      </div>
    </div>
  )
}