import styles from './JoinInformationInput.module.css'

export default function JoinInformationInput() {
  return(
    <div>
      {/* 아이디 */}
      <div className={styles.setId}>
        <input type='text' placeholder={'설정하실 아이디를 입력해주십시오.'}/>
      </div>
      {/* 비밀번호 */}
      <div className={styles.setPW}>
        <input type='text' placeholder={'설정하실 비밀번호를 입력해주십시오.'}/>
      </div>
      {/* 이메일 */}
      <div className={styles.setEmail}>
        <input type='text' placeholder={'이메일을 입력해주십시오.'}/>
      </div>
      {/* 이름 */}
      <div className={styles.setName}>
        <input type='text' placeholder={'성함을 입력해주십시오.'}/>
      </div>
      {/* 전화번호 */}
      <div className={styles.setNumber}>
        <input type='text' placeholder={'전화번호를 입력해주십시오.'}/>
      </div>
      {/* 인증 요청- 누르면 하단에 인증번호 입력란이 나타나고 타이머 표시 */}
      <div className={styles.requestSecurityNumber}>

      </div>
      {/* 취소 */}
      <div className={styles.back}>

      </div>
      {/* 확인 */}
      <div className={styles.complete}>

      </div>

      
    </div>
  )
}