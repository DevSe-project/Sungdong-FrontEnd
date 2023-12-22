import { useNavigate, useParams } from 'react-router-dom';
import styles from './AdminCategoryEdit.module.css'
import { AdminHeader } from '../Layout/Header/AdminHeader'
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData'
export function AdminCategoryEdit(props){
    //주소창 입력된 id값 받아오기
    let {id} = useParams();
    const loadData = ()=> {
      if(props.data){
        //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
        const data = props.data.find((detailData)=>detailData.id==id);
        return data;
      } else {
        return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
      }
    }
    
    const navigate = useNavigate();
  
    //로딩된 데이터 불러오기
    const detailData = loadData();

  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <div className={styles.tableLocation}>
          <h1 style={{marginBottom: '0.5em'}}>선택한 상품</h1>
          <table className={styles.table}>
            <thead 
            style={{backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'}}
            >
              <tr>
                <th>이미지</th>
                <th>상품코드</th>
                <th>현재 카테고리</th>
                <th>상품명</th>
                <th>표준가</th>
                <th style={{fontWeight: '650'}}>공급가</th>
              </tr>
            </thead>
            <tbody>
              {props.data 
              ? 
                <tr className={styles.list}>
                  <td><img src={detailData.image.mini} alt='이미지'></img></td>
                  <td>{detailData.id}</td>
                  <td style={{fontWeight: 650}}> {detailData.category.main} - {detailData.category.sub} </td>
                  <td>
                    <h5 style={{fontSize: '1.1em', fontWeight: '550'}}>{detailData.title}</h5>
                  </td>
                  <td>\{detailData.price.toLocaleString()}</td>
                  <td style={{fontWeight: '750'}}>
                    {detailData.finprice
                    ? detailData.discount
                    ? `\\${ (detailData.finprice - (((detailData.price/100)*detailData.discount)*detailData.cnt)).toLocaleString()}`
                    : `\\${detailData.finprice.toLocaleString()}`
                    : `\\${detailData.price.toLocaleString()}`}
                  </td>
                </tr>
              : <tr><td>로딩중</td></tr>
              }
            </tbody>
          </table>
          <hr style={{marginTop: '3em'}}/>
          <div className={styles.changedCategory}>
            <div style={{width: '100%', borderBottom: '3px dotted lightgray', marginBottom: '3em'}}>
              <h1>현재 카테고리</h1>
              <p style={{fontSize: '2em', fontWeight: '750'}}>
                {detailData.category.main} - {detailData.category.sub}
              </p>
            </div>
            <h1>변경할 카테고리</h1>
            <div style={{display: 'flex', gap: '1em', marginTop: '1em', alignItems: 'center'}}>
              <div className={styles.categoryContainer}>
                <div className={styles.categoryInner}>
                  메인 카테고리
                  <i className="far fa-chevron-right" style={{color: 'gray'}}/>
                </div>
              </div>
              <div className={styles.categoryContainer}>
                <div className={styles.categoryInner}>
                  서브 카테고리
                </div>
              </div>
            </div>
            <div className={styles.buttonBox}>
              <button className={styles.selectedButton}>변경</button>
              <button onClick={()=> navigate("/adminMain/category")} className={styles.selectButton}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}