import { useNavigate } from 'react-router-dom';
import styles from './Pay.module.css'
export function Pay(props){
  const navigate = useNavigate();
  // submit 버튼
  function gotoLink(){
    if(props.activeTab===3) {
      props.setActiveTab(4);
      navigate("/basket/order");
    }
  }
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
        <button onClick={()=>gotoLink()} className={styles.button}>결제완료</button>
      </div>
    </>
  )
}