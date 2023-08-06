import { CategoryBar } from './CategoryBar'
import { TopBanner } from './TopBanner'
import styles from './LikeItem.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function LikeItem(props){
  const navigate = useNavigate();
  // 체크박스를 통해 선택한 상품들을 저장할 상태 변수
  const [selectedItems, setSelectedItems] = useState([]);

  // 전체 선택 체크박스 상태를 저장할 상태 변수
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택 체크박스 클릭 시 호출되는 함수
  function handleSelectAllChange() {
    setSelectAll(!selectAll);

    if (!selectAll) {
      const allId = props.wishlist.map((item) => item.id);
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

  // 선택된 항목들을 삭제하는 함수
  const DeletedList = () => {
    //props.wishlist 배열에서 selectedItems에 포함된(체크박스 선택된) 항목들이 아닌 것들로 새로운 배열을 생성
    const updatedWishlist = props.wishlist.filter((item) => !selectedItems.includes(item.id)); 
    props.setWishlist(updatedWishlist);

    // LocalStorage에 업데이트된 찜 목록 저장
    localStorage.setItem('likelist', JSON.stringify(updatedWishlist));

    // 선택된 항목들 초기화
    setSelectedItems([]);
    
    //알림
    alert("찜 리스트에서 해당 품목이 성공적으로 삭제되었습니다.")
  };
  return(
    <div>
      <TopBanner/>
      <CategoryBar/>
      <div className={styles.body}>
        <div className={styles.head}>
          <h1><i class="fa-solid fa-heart"/> 찜 리스트</h1>
        </div>
        <div className={styles.tablebody}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th><input 
                type='checkbox'
                checked={selectAll}
                onChange={()=>handleSelectAllChange()}/></th>
                <th>상품 이미지</th>
                <th className={styles.name}>상품명</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
            {props.wishlist.map((item)=>(
              <tr>
                <td>
                  <input 
                  checked={selectedItems.includes(item.id)}
                  onChange={() => checkedBox(item.id)}
                  type='checkbox'
                  />
                </td>
                <td><img src='../image/logo.jpeg' alt='이미지'/></td>
                <td><span className={styles.link} onClick={()=>navigate(`/detail/${item.id}`)}>{item.title}</span></td>
                <td>\{item.price}</td>
              </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.buttonDiv}>
            <button 
            onClick={()=>DeletedList()}
            className={styles.deletebutton}
            >제거</button>
            <button className={styles.button}>장바구니에 추가</button>
          </div>
        </div>
      </div>
    </div>
  )
}