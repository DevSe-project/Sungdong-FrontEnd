import { useNavigate } from 'react-router-dom';
import styles from './Pay.module.css'
import { useEffect } from 'react';
import { useDataStore } from '../../Store/DataStore';
export function Pay(props){
  const navigate = useNavigate();
  // submit 버튼
  function gotoLink(){
    if(props.activeTab===3) {
      props.setActiveTab(4);
      navigate("/orderStep/order");
    }
  }
  // 주소창으로 접근 등 잘못된 접근 시 경고창 표시 후 홈으로 이동 
  useEffect(()=>{
    if (props.activeTab !== 3) {
      alert("잘못된 접근입니다.")
      props.setActiveTab(1);
      navigate("/");
    }
  }, [navigate, props])

  return(
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.label}>
            <label>결제방법</label>
          </div>
          <div className={styles.input}>
            <span>무통장 입금</span>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.label}>
            <label>입금 계좌번호</label>
          </div>
          <div className={styles.input}>
            <input className={styles.inputSize} disabled placeholder='국민 계좌번호~~~내용'/>
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.label}>
            <label>입금자명</label>
          </div>
          <div className={styles.input}>
            <input required type="text" placeholder='입금자명을 입력해주세요' className={styles.inputSize} />
          </div>
        </div>
      </div>
      <div>
        <button onClick={()=>gotoLink()} className={styles.button}>주문완료</button>
      </div>
    </>
  )
}