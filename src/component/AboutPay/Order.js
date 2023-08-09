import styles from './Order.module.css'
export function Order(){
  return(
    <div className={styles.container}>
      <h1 className={styles.headTag}>받으시는 분 정보</h1>
      <form className={styles.form}>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>성함</label>
          </div>
          <div className={styles.input}>
            <span>홍길동~~~~</span>
          </div>
        </div>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>전화번호</label>
          </div>
          <div className={styles.input}>
            <span>니 전번~~</span>
          </div>
        </div>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>주소</label>
          </div>
          <div className={styles.input}>  
            <span>니 주소~</span>
          </div>
        </div>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>배송 방식</label>
          </div>
          <div className={styles.input}>
            <span>배송 방식 ㅁㄴㅇㅁㄴㅇ</span>
          </div>
        </div>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>배송 메세지</label>
          </div>
          <div className={styles.input}>
            <span>배송 메세지 ㅁㄴㅇㅁㄴㅇ</span>
          </div>
        </div>
      </form>

      <h1 className={styles.headTag}>결제 수단</h1>
      <form className={styles.form}>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>결제 방법</label>
          </div>
          <div className={styles.input}>
            <span> 무통장입금 ( 입금 계좌 : 국민 ~~ ) </span>
          </div>
        </div>
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>증빙서류 발급</label>
          </div>
          <div className={styles.input}>
            <span> 발행안함 </span>
          </div>
        </div>
      </form>
    </div>
  )
}