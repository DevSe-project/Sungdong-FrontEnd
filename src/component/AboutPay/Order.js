import styles from './Order.module.css'
export function Order(){
  const orderInputValue = [
    { id : 0, title : '성함', value : '김태훈'},
    { id : 1, title : '전화번호', value : '01055888929'},
    { id : 2, title : '주소', value : '~~시 ~~동'},
    { id : 3, title : '배송방식', value : '화물 택배'},
    { id : 4, title : '배송 메세지', value : '빨리와요!' },
  ];
  const payInputValue = [
    { id : 0, title : '결제 방법', value : '무통장입금 ( 입금 계좌 : 국민 ~~ )!' },
    { id : 1, title : '증빙 서류 발급', value : '발급 안함' },
  ]
  return(
    <div className={styles.container}>
      <h1 className={styles.getInformation}>받으시는 분 정보</h1>
      <form className={styles.form}>
        {/* 주문자 정보 */}
        {orderInputValue.map((item, index) => 
        <div key={index} className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span>{item.value}</span>
          </div>
        </div>
        )}
      </form>

      <h1 className={styles.getInformation}>결제 수단</h1>
      <form className={styles.form}>
        {/* 결제 방식 정보 */}
        {payInputValue.map((item, index) => 
        <div className={styles.formInner}>
          <div className={styles.label}>
            <label>{item.title}</label>
          </div>
          <div className={styles.input}>
            <span> {item.value} </span>
          </div>
        </div>
        )}
      </form>
    </div>
  )
}