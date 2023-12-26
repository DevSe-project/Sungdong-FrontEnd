import { useQuery } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../Store/DataStore';
import styles from './Table.module.css';
import { TackBackFilter } from './TakeBackFilter';
import TakeBackModal from './TakeBackModal';
import { useState } from 'react';
export function TackBackRequest(){
  const { isModal } = useModalState();
  const { setIsModal } = useModalActions();
  const { data, isLoading, isError, error } = useQuery({queryKey: ['data']});
  // 게시물 데이터와 페이지 번호 상태 관리    
  const [currentPage, setCurrentPage] = useState(1);
  //현재 페이지에 해당하는 게시물 목록 가져오기
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * 5; // 한 페이지에 5개씩 표시
    return data.length > 0 
    ? data.slice(startIndex, startIndex + 5)
    : data.slice(startIndex, startIndex + 5)
    
  };
  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return(
    <div className={styles.body}>
      {/* 헤드라인 */}
      <div className={styles.head}>
        <h1><i className="fa-solid fa-heart"/> 반품신청</h1>
      </div>
      {/* 필터 */}
      <TackBackFilter/>
      {/* 테이블 */}
      <div className={styles.tablebody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>일자</th>
              <th>증빙</th>
              <th>적요</th>
              <th>단위</th>
              <th>수량</th>
              <th>단가</th>
              <th>판매액</th>
              <th>할인 및 입금액</th>
              <th>잔액</th>
              <th>반품증 작성</th>
            </tr>
            <tr>
              <th colSpan="2">전월이월</th>
              <th colSpan="6"></th>
              <th>잔액(숫자값)</th>
              <th></th>
            </tr>
          </thead>
          {getCurrentPagePosts().map((item,index) => (
          <tbody>
            <tr>
              <td>date</td>
              <td>id값</td>
              <td>상품명/코드/브랜드/규격</td>
              <td>EA</td>
              <td>수량</td>
              <td>단가</td>
              <td>판매액</td>
              <td>입금액</td>
              <td>잔액</td>
              <td>
                <button 
                className={styles.button}
                onClick={() => { setIsModal(true) }}
                >작성</button>
              </td>
            </tr>
          </tbody>
          ))}
          <tfoot>
            <tr>
              <th colSpan="2">월계</th>
              <th colSpan="4"></th>
              <th>판매액(숫자값)</th>
              <th>할인 및 입금액</th>
              <th>잔액(숫자값)</th>
              <th></th>
            </tr>
            <tr>
              <th colSpan="2">누계</th>
              <th colSpan="4"></th>
              <th>판매액(숫자값)</th>
              <th>입금액</th>
              <th>잔액(숫자값)</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
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
          if(data.length > 5){
            setCurrentPage(currentPage + 1)
          } else {
            alert("다음 페이지가 없습니다.")
          }}}>
            <i className="far fa-angle-right"/>
        </button>
      </div>
      </div>
      {/* --------------TakeBack-Modal-------------- */}
        {isModal &&
        <div className={styles.modalOverlay}>
          <TakeBackModal />
        </div>}
    </div>
  )
}